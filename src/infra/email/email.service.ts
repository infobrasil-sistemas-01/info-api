import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { google } from 'googleapis';
import * as nodemailer from 'nodemailer';
import { EnvService } from 'src/config/env/env.service';

@Injectable()
export class EmailService implements OnModuleInit {
  private readonly logger = new Logger(EmailService.name);
  private oauth2Client: any;

  constructor(private readonly env: EnvService) {
    this.oauth2Client = new google.auth.OAuth2(
      this.env.get('GMAIL_CLIENT_ID'),
      this.env.get('GMAIL_CLIENT_SECRET'),
      'http://localhost:3000/oauth2callback',
    );

    this.oauth2Client.setCredentials({
      refresh_token: this.env.get('GMAIL_REFRESH_TOKEN'),
    });
  }

  async onModuleInit() {
    try {
      const { token } = await this.oauth2Client.getAccessToken();
      if (!token) throw new Error('Não foi possível obter o Access Token');
      this.logger.log(`Gmail API OAuth2 validada para: ${this.env.get('GMAIL_USER')}`);
    } catch (error: any) {
      this.logger.error(
        `Falha na validação do Gmail OAuth2 (${this.env.get('GMAIL_USER')}): ${error.message}`,
        error.stack,
      );
    }
  }

  async sendEmail(to: string, subject: string, html: string) {
    try {
      const gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });

      // Build MIME message
      const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
      const messageParts = [
        `From: InfoBrasil Sistemas <${this.env.get('GMAIL_USER')}>`,
        `To: ${to}`,
        `Content-Type: text/html; charset=utf-8`,
        `MIME-Version: 1.0`,
        `Subject: ${utf8Subject}`,
        '',
        html,
      ];
      const message = messageParts.join('\n');

      // Encode to base64url
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const result = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });

      this.logger.log(`E-mail enviado via API para ${to}: ${result.data.id}`);
      return result;
    } catch (error) {
      this.logger.error(`Erro ao enviar e-mail via API para ${to}`, error.stack);
      throw error;
    }
  }

  async sendToSupport(subject: string, html: string) {
    const supportEmail = this.env.get('SUPPORT_EMAIL');
    return this.sendEmail(supportEmail, subject, html);
  }
}
