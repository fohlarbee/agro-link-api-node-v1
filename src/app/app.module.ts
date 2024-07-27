import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";
import { BusinessModule } from "src/business/business.module";
import { FilesUploadModule } from "src/files/files.module";
import { MenuModule } from "src/menus/menu.module";
import { OrderModule } from "src/orders/order.module";
import { TransactionModule } from "src/transactions/transaction.module";
import { ShiftsModule } from "src/shifts/shifts.module";
import { StaffsModule } from "src/staffs/staffs.module";
import { RolesModule } from "src/roles/roles.module";
import { OutletsModule } from "src/outlets/outlets.module";
import { OptionsModule } from "src/options/options.module";
import { EventsGatewayModule } from "src/events/events.module";
import { MailModule } from "src/mail/mail.module";
import { OtpModule } from "src/otp/otp.module";
import { UsersModule } from "src/users/users.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    FilesUploadModule,
    OptionsModule,
    MenuModule,
    OutletsModule,
    BusinessModule,
    RolesModule,
    OrderModule,
    ShiftsModule,
    StaffsModule,
    TransactionModule,
    EventsGatewayModule,
    MailModule,
    OtpModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
