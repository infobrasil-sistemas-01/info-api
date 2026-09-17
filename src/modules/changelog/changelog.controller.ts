import {
  Controller,
  Get,
  Res,
  Header,
  Param,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import { ChangelogService } from './changelog.service';
import * as fs from 'fs';
import * as path from 'path';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Changelog')
@Controller('changelog')
export class ChangelogController {
  constructor(private readonly changelogService: ChangelogService) {}

  @Get('data')
  @Header('Cache-Control', 'public, max-age=60')
  @ApiOperation({
    summary: 'Obter lista de releases humanizadas e estatísticas (Público)',
  })
  @ApiResponse({
    status: 200,
    description:
      'Catálogo de releases humanizadas e métricas retornado com sucesso.',
  })
  async getData() {
    const stats = this.changelogService.getStats();
    const releases = this.changelogService.getAllReleases();

    return {
      stats,
      releases,
    };
  }

  @Get('data/:version')
  @ApiOperation({
    summary: 'Obter detalhes de uma versão específica (Público)',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados da versão retornados com sucesso.',
  })
  async getVersionData(@Param('version') version: string) {
    const release = this.changelogService.getReleaseByVersion(version);
    if (!release) {
      throw new NotFoundException(
        `Versão ${version} não encontrada no histórico de releases.`,
      );
    }
    return release;
  }

  @Get()
  @ApiOperation({
    summary: 'Página interativa do Changelog Humanizado (Pública)',
  })
  @ApiResponse({
    status: 200,
    description: 'Interface web do changelog em HTML.',
  })
  async getChangelogPage(@Res() res: Response) {
    const templatePath = this.getTemplatePath();
    if (!fs.existsSync(templatePath)) {
      return res
        .status(404)
        .send('Template da página de changelog não encontrado.');
    }

    const html = fs.readFileSync(templatePath, 'utf8');
    res.type('text/html').send(html);
  }

  private getTemplatePath(): string {
    const devPath = path.join(__dirname, 'templates', 'changelog.html');
    if (fs.existsSync(devPath)) {
      return devPath;
    }

    const prodPath = path.join(
      process.cwd(),
      'dist',
      'src',
      'modules',
      'changelog',
      'templates',
      'changelog.html',
    );
    if (fs.existsSync(prodPath)) {
      return prodPath;
    }

    const altDistPath = path.join(
      process.cwd(),
      'dist',
      'modules',
      'changelog',
      'templates',
      'changelog.html',
    );
    if (fs.existsSync(altDistPath)) {
      return altDistPath;
    }

    return devPath;
  }
}
