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
        name: 'page',
        default: 1,
        type: Number,
        description: 'Página a ser retornada (Máximo 100)',
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
    })
    @ApiResponse({
        status: 401,
        description: 'Token de autenticação inválido ou ausente.',
    })
    @ApiResponse({
        status: 403,
        description: 'Token de autenticação inválido ou ausente.',
    })
    async get(@Req() req: ReqWithAuthContext, @Query() params: { page?: number, clientId?: number, arId?: number, situation?: string, startDate?: string, endDate?: string }) {
        const { credentialsId, storeId } = req.authContext || {};

        if (!credentialsId) {
            throw new Error('Credentials ID not found in token');
        }

        if (!storeId) {
            throw new Error('Store ID not found in token');
        }

        return this.accountReceivableService.get(credentialsId, params.page, params.clientId, params.arId, params.situation, params.startDate, params.endDate);
    }
}