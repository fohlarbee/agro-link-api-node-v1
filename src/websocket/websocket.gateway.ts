import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import { Socket, Server } from "socket.io";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

class CustomSocket extends Socket {
  user: User;
}

@WebSocketGateway({ cors: true })
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  afterInit(server: Server) {
    server.use(async (socket: CustomSocket, next) => {
      const { token } = socket.handshake.auth as any;
      if (!token) return next(new Error("Missing token"));
      try {
        const payload = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        });
        const user = await this.prisma.user.findUnique({
          where: { id: payload.sub },
        });
        if (!user) next(new Error("Unauthorised"));
        socket.user = user;
        next();
      } catch (error) {
        console.log(error);
        next(error);
      }
    });
  }

  handleConnection(client: CustomSocket) {
    client.join([`${client.user.id}:notifications`]);
    console.log(`${client.user.name} connected and joined rooms`);
  }

  handleDisconnect(client: CustomSocket) {
    client.rooms.forEach((room) => client.leave(room));
    console.log(`${client.user.name} left rooms and disconnected`);
  }

  sendEvent(userId: number, event: string, payload: any) {
    return this.server.to(`${userId}:notifications`).emit(event, payload);
  }
}
