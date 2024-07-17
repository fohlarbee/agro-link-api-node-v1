import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(
    email: string,
    generatedOTP: string,
    purpose: string,
    subject: string,
  ): Promise<any> {
    await this.mailerService.sendMail({
      to: email,
      from: process.env.AUTH_USER,
      subject,
      template: "./confirmation",
      context: {
        name: email,
        generatedOTP,
        purpose,
      },
    });
  }
}
