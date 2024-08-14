import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { MailService } from "src/mail/mail.service";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { CreateOTPDto } from "./dto/create-otp.dto";

@Injectable()
export class OtpService {
  constructor(
    private readonly mailService: MailService,
    private readonly prisma: PrismaService,
  ) {}

  async sendVerificationEmail({
    email,
    generatedOTP,
    subject,
    purpose,
  }: CreateOTPDto): Promise<any> {
    subject = "Email Verification";
    purpose = "Enter the Code below to Proceed to Account creation";

    return await this.mailService.sendEmail(
      email,
      generatedOTP,
      purpose,
      subject,
    );
  }
  async sendVerifyEmailForDeviceUUID({
    email,
    generatedOTP,
    subject,
    purpose,
  }: CreateOTPDto): Promise<any> {
    subject = "Email(device) Verification";
    purpose = "Enter the Code below to Proceed to verify your device";

    return await this.mailService.sendEmail(
      email,
      generatedOTP,
      purpose,
      subject,
    );
  }

  async sendResetPasswordEmail({
    email,
    generatedOTP,
    subject,
    purpose,
  }: CreateOTPDto): Promise<any> {
    subject = "Password reset";
    purpose = "Enter the Code below to Proceed to Reset Password";

    return await this.mailService.sendEmail(
      email,
      generatedOTP,
      purpose,
      subject,
    );
  }

  async verifyOTP(otp: string, email: string) {
    const matchedOTPRecord = await this.prisma.otp.findFirst({
      where: { email },
    });

    if (!matchedOTPRecord) {
      throw new NotFoundException("User Email not Found");
    }

    //check if code is expired

    const { expiresAt } = matchedOTPRecord;

    if (new Date(expiresAt).getTime().toString() <= Date.now().toString()) {
      await this.prisma.otp.delete({ where: { email } });
      throw new HttpException("Otp expired", 403);
    }

    // verify code, if not expired

    const hashedOTP = matchedOTPRecord.otp;
    const validOTP = await bcrypt.compare(otp, hashedOTP);

    if (!validOTP) {
      throw new HttpException("Invalid OTP signature", 403);
    }

    await this.prisma.otp.update({
      where: { email },
      data: { isVerified: true },
    });

    return true;
  }
}
