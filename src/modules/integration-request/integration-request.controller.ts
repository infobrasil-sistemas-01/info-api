import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  Patch,
  Delete,
  Param,
  InternalServerErrorException,
  Render,
} from '@nestjs/common';
import {
  ApiExcludeController,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/infra/rbac/permissions.guard';
import { RequirePermissions } from 'src/infra/rbac/permissions.decorator';
import { CreateIntegrationRequestDto } from './dto/create-integration-request.dto';
import { IntegrationRequestService } from './integration-request.service';
import { UserService } from '../user/user.service';

@ApiTags('Integration Requests')
@ApiExcludeController()
@Controller('integration')
export class IntegrationRequestController {
  constructor(
    private readonly service: IntegrationRequestService,
    private readonly userService: UserService,
  ) { }

  @Get('setup-password/:token')
  @ApiOperation({ summary: 'Serve a interface de configuração de senha' })
  serveSetupPassword(@Res() res: Response) {
    const path = this.getTemplatePath('setup-password.html');
    return res.sendFile(path);
  }

  @Post('setup-password/:token')
  @ApiOperation({ summary: 'Gera e configura a senha do usuário via token' })
  async handleSetupPassword(@Param('token') token: string) {
    return this.userService.setupPasswordByToken(token);
  }

  @Get('client')
  @ApiOperation({ summary: 'Serve o dashboard do cliente' })
  clientDashboard(@Res() res: Response) {
    const path = this.getTemplatePath('client.html');
    return res.sendFile(path);
  }

  @Get('form')
  @ApiOperation({ summary: 'Serve a interface de formulário para o cliente' })
  serveForm(@Res() res: Response) {
    const path = this.getTemplatePath('form.html');
    return res.sendFile(path);
  }

  @Get('admin')
  @ApiOperation({ summary: 'Serve o painel administrativo para o suporte' })
  serveAdmin(@Res() res: Response) {
    const path = this.getTemplatePath('admin.html');
    return res.sendFile(path);
  }

  @Get('assets/:file')
  @ApiOperation({ summary: 'Serve arquivos estáticos para o painel administrativo' })
  serveAssets(@Param('file') file: string, @Res() res: Response) {
    const path = this.getTemplatePath(join('assets', file));
    return res.sendFile(path);
  }

  private getTemplatePath(fileName: string): string {
    const paths = [
      // 1. Caminho padrão no build (dist/src/modules/integration-request/templates/...)
      join(__dirname, 'templates', fileName),
      // 2. Caminho alternativo no build (dist/modules/integration-request/templates/...)
      // Se __dirname for 'dist/src/modules/integration-request', subimos 3 níveis para chegar em 'dist'
      join(
        __dirname,
        '..',
        '..',
        '..',
        'modules',
        'integration-request',
        'templates',
        fileName,
      ),
      // 3. Outro caminho alternativo (dist/src/modules/integration-request/templates/...)
      join(__dirname, '..', 'templates', fileName),
      // 4. Caminho em desenvolvimento (src/modules/...)
      join(
        process.cwd(),
        'src',
        'modules',
        'integration-request',
        'templates',
        fileName,
      ),
    ];

    for (const p of paths) {
      if (existsSync(p)) return p;
    }

    throw new InternalServerErrorException(
      `Template ${fileName} não encontrado em nenhum dos locais esperados.`,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Cria uma nova solicitação de integração' })
  @ApiResponse({ status: 201, description: 'Solicitação criada com sucesso' })
  create(@Body() dto: CreateIntegrationRequestDto) {
    return this.service.create(dto);
  }

  @Get('confirm/:id')
  @ApiOperation({ summary: 'Confirma o e-mail do cliente' })
  async confirm(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.service.confirm(id);
      const path = this.getTemplatePath('confirmed.html');
      return res.sendFile(path);
    } catch (error) {
      // Mesmo se der erro, vamos mostrar uma página amigável (ou o erro)
      const path = this.getTemplatePath('confirmed.html');
      // Passar contexto via query ou algo similar se fosse SSR, 
      // mas como é static, o confirmed.html pode lidar com estados via JS se necessário.
      // Por simplicidade, vamos apenas enviar o arquivo.
      return res.sendFile(path);
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ anyOf: ['integration-request.view'] })
  @ApiOperation({ summary: 'Lista todas as solicitações (Requer autenticação)' })
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({
    anyOf: ['integration-request.approve', 'integration-request.reject'],
  })
  @ApiOperation({ summary: 'Atualiza o status de uma solicitação' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('rejectionReason') rejectionReason?: string,
  ) {
    return this.service.updateStatus(id, status, rejectionReason);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions({ anyOf: ['integration-request.delete'] })
  @ApiOperation({ summary: 'Exclui uma solicitação' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
