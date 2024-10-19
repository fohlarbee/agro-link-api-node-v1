import { Injectable } from "@nestjs/common";
import { WebsocketGateway } from "./websocket.gateway";

@Injectable()
export class WebsocketService {
  constructor(private gateway: WebsocketGateway) {}

  notifyUser(userId: number, event: string, payload: any) {
    return this.gateway.sendEvent([`user-${userId}`], event, payload);
  }
  notifyAttendant(userId: number, event: string, payload: any) {
    return this.gateway.sendEvent(
      [`attendant-${userId}`, `business-${payload.businessId}`],
      event,
      payload,
    );
  }
  notifyAdmin(userId: number, event: string, payload: any) {
    return this.gateway.sendEvent(
      [`admin-${userId}`, `business-${payload.businessId}`],
      event,
      payload,
    );
  }
  notifyBusiness(businessId: number, event: string, payload: any) {
    return this.gateway.sendEvent([`business-${businessId}`], event, payload);
  }
  notifyWallet(walletId: number, event: string, payload: any) {
    return this.gateway.sendEvent([`wallet-${walletId}`], event, payload);
  }
}
