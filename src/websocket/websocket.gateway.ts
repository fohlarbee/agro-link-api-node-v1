import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from "@nestjs/websockets";
import { JwtService } from "@nestjs/jwt";
import { Socket, Server } from "socket.io";
import { Business, User, Wallet } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

class CustomSocket extends Socket {
  user: User;
  business?: Business;
  wallet?: Wallet;
  businessWallet?: Wallet;
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
        if (!user) return next(new Error("Unauthorised"));
        socket.user = user;
        const wallet = await this.prisma.wallet.findUnique({
          where: { userId: user.id },
        });
        socket.wallet = wallet;
        const staff = await this.prisma.staff.findFirst({
          where: { userId: user.id },
          select: { business: true, role: true },
        });
        if (!staff) return next();
        socket.business = staff.business;
        if (["admin"].includes(staff.role.name))
          socket.businessWallet = await this.prisma.wallet.findFirst({
            where: { businessId: staff.business.id },
          });
        next();
      } catch (error) {
        console.log(error);
        next(error);
      }
    });
  }
  handleConnection(client: CustomSocket) {
    let rooms = [`user-${client.user.id}`];
    if (client.wallet?.id) rooms.push(`wallet-${client.wallet.id}`);
    if (client.business) {
      // rooms = [`${client.business.id}:business`];
      switch (client.user.role) {
        case "attendant":
          rooms = [];
          rooms.push(
            `attendant-${client.user.id}`,
            `business-${client.business.id}`,
          );
          if (client.wallet?.id) rooms.push(`wallet-${client.wallet.id}`);
          break;
        case "admin":
          rooms = [];
          rooms.push(
            `admin-${client.user.id}`,
            `business-${client.business.id}`,
          );
          if (client.businessWallet?.id)
            rooms.push(`wallet-${client.businessWallet.id}`);
          break;
        default:
          ``;
          rooms.push();
      }
    }
    client.join(rooms);
    client.on("ping", (callback) => {
      callback();
      client.emit("pong", callback());
    });
    console.log(`${client.user.name} connected and joined rooms`, rooms);
  }

  handleDisconnect(client: CustomSocket) {
    client.rooms.forEach((room) => client.leave(room));
    console.log(`${client.user.name} left rooms and disconnected`);
  }

  sendEvent(rooms: string[], event: string, payload: any) {
    return this.server.to(rooms).emit(event, payload);
  }
  @SubscribeMessage("newMessage")
  newMessage(client: CustomSocket, message: string) {
    console.log(message);
  }
}
