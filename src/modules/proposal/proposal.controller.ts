import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { ReqWithAuthContext } from '../auth/guards/jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { IncludeCount } from 'src/common/decorators/include-count.decorator';
import { ProposalService } from './proposal.service';
import {
  GetProposalByIdQueryDto,
  ProposalQueryDto,
} from './dto/proposal-query.dto';
import {
  ProposalDetailResponseDto,
  ProposalItemResponseDto,
  ProposalResponseDto,
} from './dto/proposal-response.dto';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';

@ApiTags('Proposals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('proposals')
export class ProposalController {
  constructor(private readonly proposalService: ProposalService) {}

  @Post()
  @RequirePermissions({ allOf: ['tenant.proposals.create'] })
  @ApiOperation({
    summary: 'Criar proposta comercial',
    description:
      'Cria uma nova proposta na tabela PROPOSTAS (sempre inicializada com PRO_GERADA = "N", pois a conversão em venda é exclusiva do sistema) e seus itens na tabela ITENSPRO em transação atômica, seguindo estritamente a nomenclatura das colunas do banco.',
  })
  @ApiResponse({
    status: 201,
    description: 'Proposta criada com sucesso.',
    type: ProposalDetailResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou produtos não encontrados.',
  })
  @ApiResponse({
    status: 403,
    description:
      'Operador H2M não autorizado a criar proposta em nome de outro vendedor/usuário ou filial.',
  })
  async create(
    @Req() req: ReqWithAuthContext,
    @Body() body: CreateProposalDto,
  ) {
    const {
      credentialsId,
      storeId: storeIdToken,
      usuCodigo,
      funCodigo,
      type,
    } = req.authContext || {};

    if (!credentialsId) {
      throw new BadRequestException('Credentials ID not found in token');
    }

    const isH2M = type === 'H2M';

    if (
      isH2M &&
      body.LOJ_CODIGO !== undefined &&
      storeIdToken !== undefined &&
      body.LOJ_CODIGO !== storeIdToken
    ) {
      throw new ForbiddenException(
        'Operador não autorizado a registrar propostas em outra filial.',
      );
    }

    if (
      isH2M &&
      body.USU_CODIGO !== undefined &&
      body.USU_CODIGO !== null &&
      usuCodigo !== undefined &&
      body.USU_CODIGO !== usuCodigo
    ) {
      throw new ForbiddenException(
        'Operador não autorizado a registrar propostas em nome de outro usuário.',
      );
    }

    if (
      isH2M &&
      funCodigo !== undefined &&
      body.FUN_CODIGO !== funCodigo
    ) {
      throw new ForbiddenException(
        'Operador não autorizado a registrar propostas em nome de outro funcionário.',
      );
    }

    const finalStoreId = isH2M
      ? storeIdToken
      : (body.LOJ_CODIGO ?? storeIdToken);

    if (!finalStoreId) {
      throw new BadRequestException('ID da loja (LOJ_CODIGO) não informado');
    }

    const finalOperatorId = isH2M
      ? Number(usuCodigo) || 1
      : Number(body.USU_CODIGO ?? usuCodigo) || 1;

    return this.proposalService.create(
      credentialsId,
      finalStoreId,
      finalOperatorId,
      body,
    );
  }

  @Get()
  @RequirePermissions({ allOf: ['tenant.proposals.view'] })
  @ApiOperation({
    summary: 'Listar propostas comerciais',
    description:
      'Retorna a listagem paginada da tabela PROPOSTAS com suporte a filtros e cabeçalhos de paginação via X-Request-Count: true.',
  })
  @ApiHeader({
    name: 'X-Request-Count',
    required: false,
    description:
      'Envie "true" para incluir os cabeçalhos X-Total-Count e X-Total-Pages na resposta',
    example: 'true',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de propostas retornada com sucesso.',
    type: [ProposalResponseDto],
  })
  async get(
    @Req() req: ReqWithAuthContext,
    @Query() query: ProposalQueryDto,
    @IncludeCount() includeCount: boolean = false,
  ) {
    const {
      credentialsId,
      storeId: storeIdToken,
      type,
    } = req.authContext || {};

    if (!credentialsId) {
      throw new BadRequestException('Credentials ID not found in token');
    }

    const isH2M = type === 'H2M';

    if (
      isH2M &&
      query.storeId !== undefined &&
      storeIdToken !== undefined &&
      query.storeId !== storeIdToken
    ) {
      throw new ForbiddenException(
        'Operador não autorizado a consultar propostas de outra filial.',
      );
    }

    const finalStoreId = isH2M ? storeIdToken : query.storeId;

    return this.proposalService.get(
      credentialsId,
      finalStoreId,
      query,
      includeCount ?? false,
    );
  }

  @Get(':id')
  @RequirePermissions({ allOf: ['tenant.proposals.view'] })
  @ApiOperation({
    summary: 'Obter detalhes da proposta por PRO_NUMERO',
    description:
      'Retorna o cabeçalho da proposta (PROPOSTAS) e a lista completa de itens (ITENSPRO) em ITENS.',
  })
  @ApiParam({
    name: 'id',
    description: 'Número da proposta (PRO_NUMERO)',
    example: 105,
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da proposta retornados com sucesso.',
    type: ProposalDetailResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Proposta não encontrada.' })
  async getById(
    @Req() req: ReqWithAuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetProposalByIdQueryDto,
  ) {
    const { credentialsId, storeId: storeIdToken, type } =
      req.authContext || {};

    if (!credentialsId) {
      throw new BadRequestException('Credentials ID not found in token');
    }

    const isH2M = type === 'H2M';

    if (
      isH2M &&
      query.storeId !== undefined &&
      storeIdToken !== undefined &&
      query.storeId !== storeIdToken
    ) {
      throw new ForbiddenException(
        'Operador não autorizado a consultar propostas de outra filial.',
      );
    }

    const finalStoreId = isH2M ? storeIdToken : query.storeId;

    return this.proposalService.getById(credentialsId, finalStoreId, id);
  }

  @Get(':id/items')
  @RequirePermissions({ allOf: ['tenant.proposals.view'] })
  @ApiOperation({
    summary: 'Listar itens de uma proposta (ITENSPRO)',
    description:
      'Retorna os itens vinculados a uma proposta específica pelo PRO_NUMERO.',
  })
  @ApiParam({
    name: 'id',
    description: 'Número da proposta (PRO_NUMERO)',
    example: 105,
  })
  @ApiResponse({
    status: 200,
    description: 'Itens da proposta retornados com sucesso.',
    type: [ProposalItemResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Proposta não encontrada.' })
  async getItems(
    @Req() req: ReqWithAuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const { credentialsId, storeId: storeIdToken, type } =
      req.authContext || {};

    if (!credentialsId) {
      throw new BadRequestException('Credentials ID not found in token');
    }

    const finalStoreId = type === 'H2M' ? storeIdToken : undefined;

    return this.proposalService.getItemsByProposalNumber(
      credentialsId,
      id,
      finalStoreId,
    );
  }

  @Patch(':id')
  @RequirePermissions({ allOf: ['tenant.proposals.update'] })
  @ApiOperation({
    summary: 'Atualizar proposta comercial',
    description:
      'Atualiza parcialmente os campos de PROPOSTAS. Não permite edição caso a proposta já tenha sido convertida em venda (PRO_GERADA = "S"). Caso o array ITENS seja enviado no payload, ocorre a substituição integral e atômica (DELETE + INSERT em ITENSPRO dentro da mesma transação) de todos os itens da proposta, recalculando automaticamente totais não informados.',
  })
  @ApiParam({
    name: 'id',
    description: 'Número da proposta (PRO_NUMERO)',
    example: 105,
  })
  @ApiResponse({
    status: 200,
    description: 'Proposta atualizada com sucesso.',
    type: ProposalDetailResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Dados inválidos, produtos inexistentes ou proposta já convertida em venda (PRO_GERADA = S).',
  })
  @ApiResponse({ status: 404, description: 'Proposta não encontrada.' })
  async update(
    @Req() req: ReqWithAuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProposalDto,
  ) {
    const { credentialsId, storeId: storeIdToken, type } =
      req.authContext || {};

    if (!credentialsId) {
      throw new BadRequestException('Credentials ID not found in token');
    }

    const isH2M = type === 'H2M';

    if (
      isH2M &&
      body.LOJ_CODIGO !== undefined &&
      storeIdToken !== undefined &&
      body.LOJ_CODIGO !== storeIdToken
    ) {
      throw new ForbiddenException(
        'Operador não autorizado a mover proposta para outra filial.',
      );
    }

    const finalStoreId = isH2M ? storeIdToken : undefined;

    return this.proposalService.update(credentialsId, finalStoreId, id, body);
  }
}
