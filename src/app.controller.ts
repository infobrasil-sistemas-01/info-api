import { Controller, Get, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@ApiExcludeController()
@Controller()
export class AppController {
  @Get('favicon.ico')
  serveFavicon(@Res() res: any) {
    const paths = [
      join(__dirname, 'modules', 'integration-request', 'templates', 'assets', 'favicon.ico'),
      join(__dirname, '..', 'src', 'modules', 'integration-request', 'templates', 'assets', 'favicon.ico'),
      join(process.cwd(), 'src', 'modules', 'integration-request', 'templates', 'assets', 'favicon.ico'),
      // No dist em prod
      join(__dirname, '..', 'modules', 'integration-request', 'templates', 'assets', 'favicon.ico'),
      join(__dirname, '..', '..', 'modules', 'integration-request', 'templates', 'assets', 'favicon.ico'),
    ];

    for (const p of paths) {
      if (existsSync(p)) {
        return res.sendFile(p);
      }
    }

    return res.status(404).send();
  }

  @Get()
  index(@Res() res: any) {
    return res.redirect('/integration');
  }
}
