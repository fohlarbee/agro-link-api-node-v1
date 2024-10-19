import { Body, Controller, Post, Put, Req, UseGuards } from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import {
  UserDeviceDto,
  UserDeviceUpdateDto,
} from "./dto/accept-notifications-dto";
import { NotificationDto } from "./dto/push-notifications-dto";
import { HttpAuthGuard } from "src/auth/guards/http-auth.guard";
import { ApiBearerAuth, ApiBody, ApiHeader, ApiTags } from "@nestjs/swagger";

@Controller("notifications")
@UseGuards(HttpAuthGuard)
@ApiTags("Notifications(Push)")
@ApiBearerAuth()
@ApiHeader({
  name: "access_token",
  required: true,
  description: "This is the user access token",
})
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiBody({ type: UserDeviceDto, description: "User device details" })
  async acceptPushNotifications(
    @Body() notificationFDto: UserDeviceDto,
    @Req() request,
  ) {
    const { id: userId } = request.user;
    console.log(request.user);
    return this.notificationsService.acceptPushNotifications(
      userId,
      notificationFDto,
    );
  }
  @Put()
  async disablePushNotification(
    @Req() request,
    @Body() body: UserDeviceUpdateDto,
  ) {
    const { id } = request.user;

    return this.notificationsService.disablePushNotification(id, body);
  }

  @Post("send")
  async sendPush(@Req() request, @Body() body: NotificationDto) {
    const { id: userId } = request.user;
    return this.notificationsService.sendPush(userId, body);
  }
}
