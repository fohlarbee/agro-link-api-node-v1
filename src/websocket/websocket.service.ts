import { Injectable } from "@nestjs/common";
import { WebsocketGateway } from "./websocket.gateway";

@Injectable()
export class WebsocketService {
  constructor(private gateway: WebsocketGateway) {}

  notifyUser(userId: number, event: string, payload: any) {
    console.log(userId, event, payload);
    return this.gateway.sendEvent([`${userId}:notifications`], event, payload);
  }
  notifyKitchen(userId: number, event: string, payload: any) {
    return this.gateway.sendEvent(
      [`${userId}:kitchen`, `${payload.businessId}:business`],
      event,
      payload,
    );
  }
  notifyWaiter(userId: number, event: string, payload: any) {
    return this.gateway.sendEvent(
      [`${userId}:waiter`, `${payload.businessId}:business`],
      event,
      payload,
    );
  }
  notifyBusiness(businessId: number, event: string, payload: any) {
    return this.gateway.sendEvent([`${businessId}:business`], event, payload);
  }
}
