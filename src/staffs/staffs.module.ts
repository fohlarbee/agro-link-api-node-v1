import { Module } from "@nestjs/common";
import { StaffsService } from "./staffs.service";
import { StaffsController } from "./staffs.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { MailModule } from "src/mail/mail.module";
import { PasswordService } from "./utils/password.service";

@Module({
  imports: [MailModule],
  controllers: [StaffsController],
  providers: [PrismaService, StaffsService, PasswordService],
})
export class StaffsModule {}
