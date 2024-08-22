import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as admin from "firebase-admin";
import {
  UserDeviceDto,
  UserDeviceUpdateDto,
} from "./dto/accept-notifications-dto";
import { NotificationDto } from "./dto/push-notifications-dto";

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async acceptPushNotifications(
    userId: number,
    notificationDto: UserDeviceDto,
  ) {
    console.log(userId);
    await this.prisma.userDevice.updateMany({
      where: { userId },
      data: { status: "INACTIVE" },
    });

    if (!["web", "mobile", "desktop"].includes(notificationDto.deviceType))
      throw new BadRequestException("Invalid device type");
    if (
      await this.prisma.userDevice.findFirst({
        where: { deviceToken: notificationDto.deviceToken },
      })
    )
      throw new ConflictException("Device already subscribed");

    const notification_token = await this.prisma.userDevice.create({
      data: {
        user: { connect: { id: userId } },
        deviceType: notificationDto.deviceType,
        deviceToken: notificationDto.deviceToken,
        status: "ACTIVE",
      },
    });

    return {
      message: "Subscription successful",
      status: "success",
      data: { notification_token },
    };
  }

  async disablePushNotification(userId: any, update_dto: UserDeviceUpdateDto) {
    await this.prisma.userDevice.updateMany({
      where: {
        AND: [{ user: { id: userId } }, { deviceType: update_dto.deviceType }],
      },
      data: { status: "INACTIVE" },
    });

    return {
      message: "Push notification disabled successfully",
      status: "success",
    };
  }

  async getNotifications(userDeviceId: number) {
    return await this.prisma.notifications.findMany({
      where: { userDeviceId },
    });
  }

  async sendPush(userId: number, { title, body, metadata }: NotificationDto) {
    if (!userId || !body || !title || !metadata)
      throw new BadRequestException("Invalid request body");
    const data = JSON.stringify(metadata);

    const userDevice = await this.prisma.userDevice.findFirst({
      where: { user: { id: userId }, status: "ACTIVE" },
    });
    if (userDevice) {
      await this.prisma.notifications.create({
        data: {
          metadata,
          title,
          body,
          userDeviceId: userDevice.id,
          createdBy: "userId",
        },
      });
      await admin
        .messaging()
        .send({
          notification: { title, body },
          token: userDevice.deviceToken,
          android: {
            priority: "high",
            notification: { clickAction: "www.google.com" },
          },
          apns: {
            payload: {
              aps: {
                category: "INVITE_CATEGORY",
              },
            },
          },
          webpush: { fcmOptions: { link: "www.google.com" } },
          data: { title, body, data },
        })
        .then((response) => {
          console.log(response);
          console.log("message sent");
        })
        .catch((error: any) => {
          console.error(error);
        });
    }

    return {
      message: "Push notification sent successfully",
      status: "success",
    };
  }
}

// {
//   "type": "order",
//   "data": {
//     "id": "12345",
//     "amount": 1000,
//     "transactionTime": "2024-08-21T17:36:33Z"
//   }
// }
