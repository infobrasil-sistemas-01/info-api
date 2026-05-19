import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AccountReceivableService } from "./account-receivable.service";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard, type ReqWithAuthContext } from "../auth/guards/jwt-auth.guard";
import { PermissionsGuard } from "src/infra/rbac/permissions.guard";
import { RequirePermissions } from "src/infra/rbac/permissions.decorator";

@Controller('/account-receivable')
export class AccountReceivableController {
    constructor(
        private readonly accountReceivableService: AccountReceivableService
    ) { }

    @Get()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermissions({ allOf: ['tenant.account-receivable.view'] })
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Obter contas a receber',
        description: 'Obtém uma lista de contas a receber da loja.',
    })
    @ApiQuery({
        name: 'storeId',
        default: 1,
        type: Number,
        description: 'Código da loja (LOJ_CODIGO)',
        required: false,
    })
    @ApiQuery({
        name: 'page',
        default: 1,
        type: Number,
        description: 'Página a ser retornada (Máximo 100)',
        required: false,
    })
    @ApiQuery({
        name: 'pageSize',
        default: 10,
        type: Number,
        description: 'Registros por página',
        required: false,
    })
    @ApiQuery({
        name: 'clientId',
        type: Number,
        description: 'ID do cliente',
        required: false,
    })
    @ApiQuery({
        name: 'arId',
        type: Number,
        description: 'ID da conta a receber',
        required: false,
    })
    @ApiQuery({
        name: 'situation',
        type: String,
        enum: ['A', 'L'],
        description: 'Situação da conta a receber (A - Aberto, L - Liquidado)',
        required: false,
    })
    @ApiQuery({
        name: 'startDate',
        type: String,
        description: 'Data inicial',
        required: false,
    })
    @ApiQuery({
        name: 'endDate',
        type: String,
        description: 'Data final',
        required: false,
    })
    @ApiResponse({
        status: 200,
        description: 'Contas a receber obtidas com sucesso.',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    CLI_CODIGO: { type: 'number', example: 1 },
                    CLI_NOME: { type: 'string', example: "Cliente de Teste" },
                    CLI_FONE: { type: 'string', example: "11999999999" },
                    CLI_CELULAR: { type: 'string', example: "11999999999" },
                    CLI_CONCEITO: { type: 'string', example: "A" },
                    REC_NUMERO: { type: 'number', example: 100 },
                    REC_SITUACAO: { type: 'string', example: "A" },
                    REC_DATAVENC: { type: 'string', example: "2024-05-15T00:00:00.000Z" },
                    REC_VALOR: { type: 'number', example: 150.00 }
                }
            }
        }
    })
    @ApiResponse({
        status: 401,
        description: 'Token de autenticação inválido ou ausente.',
    })
    @ApiResponse({
        status: 403,
        description: 'Token de autenticação inválido ou ausente.',
    })
    async get(
        @Req() req: ReqWithAuthContext,
        @Query() params: {
            page?: number;
            pageSize?: number;
            storeId?: number;
            clientId?: number;
            arId?: number;
            situation?: string;
            startDate?: string;
            endDate?: string;
        }
    ) {
        const { credentialsId, storeId: tokenStoreId } = req.authContext || {};

        if (!credentialsId) {
            throw new Error('Credentials ID not found in token');
        }

        if (!tokenStoreId) {
            throw new Error('Store ID not found in token');
        }

        const storeId = params.storeId !== undefined ? Number(params.storeId) : tokenStoreId;
        const page = params.page !== undefined ? Number(params.page) : 1;
        const pageSize = params.pageSize !== undefined ? Number(params.pageSize) : 10;

        return this.accountReceivableService.get(
            credentialsId,
            storeId,
            page,
            pageSize,
            params.clientId !== undefined ? Number(params.clientId) : undefined,
            params.arId !== undefined ? Number(params.arId) : undefined,
            params.situation,
            params.startDate,
            params.endDate
        );
    }
}