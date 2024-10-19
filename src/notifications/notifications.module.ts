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
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    };

    admin.initializeApp({
      credential: admin.credential.cert(
        "quik-quik-firebase-adminsdk-jxasy-478077a146.json",
      ),
    });
    // console.log('credential: ', admin.credential.cert(process.env.FIREBASE_CONFIG));
  }
}
