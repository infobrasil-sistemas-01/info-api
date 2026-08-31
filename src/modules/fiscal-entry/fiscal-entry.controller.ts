import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { ReqWithAuthContext } from '../auth/guards/jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { FiscalEntryService } from './fiscal-entry.service';
import { FiscalEntryQueryDto } from './dto/fiscal-entry-query.dto';
import { FiscalEntryResponseDto } from './dto/fiscal-entry-response.dto';

@ApiTags('Fiscal Entry')
@Controller('fiscal-entry')
export class FiscalEntryController {
  constructor(private readonly fiscalEntryService: FiscalEntryService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ allOf: ['tenant.fiscal-entries.view'] })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Listar entradas fiscais / apoio',
    description:
      'Retorna uma lista paginada de entradas de notas fiscais da tabela ENTRADAS_APOIO com dados do fornecedor.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de entradas fiscais retornada com sucesso.',
    type: [FiscalEntryResponseDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Parâmetros de busca inválidos.',
  })
  get(
    @Req() req: ReqWithAuthContext,
    @Query() query: FiscalEntryQueryDto,
  ) {
    const credentialsId = req.authContext?.credentialsId;

    if (!credentialsId) {
      throw new Error('Credentials ID not found in token');
    }

    return this.fiscalEntryService.get(credentialsId, query);
  }
}
