import { WebsocketGateway } from "./websocket.gateway";

export class WebsocketService {
    constructor(private gateway: WebsocketGateway) {}

    notifyUser(userId: number, event: string, payload: any) {
        return this.gateway.sendEvent(userId, event, payload);
    }
}