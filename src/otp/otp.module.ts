import { Module } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { MailModule } from "src/mail/mail.module";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [MailModule, PrismaModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
