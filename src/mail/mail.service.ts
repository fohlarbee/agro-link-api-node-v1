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
    username?: string,
    password?: string,
    isInvited: boolean = false,
    isReset: boolean = false,
  ): Promise<any> {
    await this.mailerService.sendMail({
      to: email,
      from: process.env.AUTH_USER,
      subject,
      template: isInvited
        ? "invite-template"
        : isReset
          ? "password-reset-template"
          : "signup-template",
      context: {
        name: isInvited || isReset ? username : email,
        generatedOTP,
        purpose,
        password,
        email,
      },
    });
  }

  async sendInvitedUserEmail(
    name: string,
    email: string,
    password: string,
  ): Promise<any> {
    return await this.sendEmail(email, "", "", "", name, password, true);
  }
}
