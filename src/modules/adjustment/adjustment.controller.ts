import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
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
import { AdjustmentService } from './adjustment.service';
import {
  AdjustmentQueryDto,
  GetAdjustmentByIdQueryDto,
} from './dto/adjustment-query.dto';
import { AdjustmentResponseDto } from './dto/adjustment-response.dto';
import { AdjustmentDetailResponseDto } from './dto/adjustment-detail-response.dto';
import { AdjustmentItemResponseDto } from './dto/adjustment-item-response.dto';

@ApiTags('Adjustment')
@Controller('adjustment')
export class AdjustmentController {
  constructor(private readonly adjustmentService: AdjustmentService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.adjustments.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar acertos de estoque',
    description:
      'Retorna uma lista paginada de acertos de estoque da tabela ACERTOS com informações de situação, loja e usuário.',
  })
  @ApiHeader({
    name: 'X-Request-Count',
    required: false,
    description:
      'Se definido como "true", calcula e retorna cabeçalhos de paginação (X-Total-Count, X-Total-Pages, X-Current-Page, X-Per-Page) na resposta.',
    schema: { type: 'string', example: 'true' },
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de acertos retornada com sucesso.',
    type: [AdjustmentResponseDto],
    headers: {
      'X-Total-Count': {
        description:
          'Total de registros encontrados considerando os filtros (presente quando X-Request-Count: true)',
        schema: { type: 'integer', example: 145 },
      },
      'X-Total-Pages': {
        description:
          'Total de páginas calculadas (presente quando X-Request-Count: true)',
        schema: { type: 'integer', example: 3 },
      },
      'X-Current-Page': {
        description:
          'Página atual solicitada (presente quando X-Request-Count: true)',
        schema: { type: 'integer', example: 1 },
      },
      'X-Per-Page': {
        description:
          'Quantidade de registros por página (presente quando X-Request-Count: true)',
        schema: { type: 'integer', example: 10 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros de busca inválidos.',
  })
  get(
    @Req() req: ReqWithAuthContext,
    @Query() query: AdjustmentQueryDto,
    @IncludeCount() includeCount: boolean = false,
  ) {
    const {
      credentialsId,
      storeId: storeIdToken,
      type,
    } = req.authContext || {};

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    const finalStoreId =
      type === 'H2M'
        ? storeIdToken
        : query.storeId
          ? Number(query.storeId)
          : storeIdToken;

    return this.adjustmentService.get(
      credentialsId,
      finalStoreId,
      query,
      includeCount,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.adjustments.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obter acerto por ID com itens',
    description:
      'Retorna os detalhes completos do acerto de estoque e seu array aninhado de itens.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Número do acerto (ACE_NUMERO)',
    example: 105,
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do acerto com itens retornados com sucesso.',
    type: AdjustmentDetailResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Acerto não encontrado.',
  })
  async getById(
    @Req() req: ReqWithAuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetAdjustmentByIdQueryDto,
  ) {
    const {
      credentialsId,
      storeId: storeIdToken,
      type,
    } = req.authContext || {};

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    const finalStoreId =
      type === 'H2M'
        ? storeIdToken
        : query.storeId
          ? Number(query.storeId)
          : storeIdToken;

    const adjustmentData = await this.adjustmentService.getById(
      credentialsId,
      finalStoreId,
      id,
    );

    if (!adjustmentData) {
      throw new NotFoundException(`Acerto ${id} não encontrado`);
    }

    const items = await this.adjustmentService.getItemsByAdjustmentNumber(
      credentialsId,
      id,
    );

    return {
      ...adjustmentData,
      items,
    };
  }

  @Get(':id/items')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.adjustments.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar itens de um acerto',
    description:
      'Retorna diretamente o array de itens vinculados a um acerto específico.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Número do acerto (ACE_NUMERO)',
    example: 105,
  })
  @ApiResponse({
    status: 200,
    description: 'Itens do acerto retornados com sucesso.',
    type: [AdjustmentItemResponseDto],
  })
  async getItems(
    @Req() req: ReqWithAuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.adjustmentService.getItemsByAdjustmentNumber(credentialsId, id);
  }
}
