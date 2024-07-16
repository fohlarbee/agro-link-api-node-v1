import { Logger } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";

@WebSocketGateway(4001)
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(EventsGateway.name);

  @WebSocketServer()
  server: Server;
  socket: Socket;

  async afterInit() {
    this.logger.log("afterInit");
    if (this.server) {
      // Check if server is initialized
      const sockets = await this.server.sockets.name; // Use await with all()
      console.log(sockets);
      console.log("WebSocket Gateway initialized");
    }
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.server.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  // handleConnection(client: Socket) {
  //   console.log(`Client connected: ${client.id}`);
  // }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("message")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() messsage: string,
  ): string {
    client.broadcast.emit("messsage", messsage);
    client.emit("message", "Your message was received");

    return "Hello world!";
  }
}
