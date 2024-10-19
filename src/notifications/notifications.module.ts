import { Module } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { NotificationsController } from "./notifications.controller";
import * as admin from "firebase-admin";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  imports: [],
  controllers: [NotificationsController],
  providers: [NotificationsService, PrismaService],
  exports: [NotificationsService],
})
export class NotificationsModule {
  constructor() {
    this.initFirebase();
  }

  private initFirebase() {
    admin.initializeApp({
      credential: admin.credential.cert(
        "agro-link-ng-firebase-adminsdk-f38ia-6e61848e02.json",
      ),
    });
  }
}
