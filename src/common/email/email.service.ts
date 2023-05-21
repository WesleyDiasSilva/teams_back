import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { getConfirmationEmailTemplate } from './templates/confirmationEmailTemplate';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.OUTLOOK_USERNAME,
        pass: process.env.OUTLOOK_PASSWORD,
      },
      tls: {
        ciphers: 'SSLv3',
      },
    });
  }

  async sendConfirmationEmail(to: string, code: string) {
    const html = getConfirmationEmailTemplate(code);
    const info: nodemailer.SentMessageInfo = await this.transporter.sendMail({
      from: process.env.OUTLOOK_USERNAME,
      to: to,
      subject: 'Confirme seu endereço de email',
      html: html,
    });

    console.log(`Message sent: ${info.messageId}`);
  }
}
