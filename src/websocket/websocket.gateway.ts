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
        if (!user) next(new Error("Unauthorised"));
        socket.user = user;
        const wallet = await this.prisma.wallet.findUnique({
          where: { userId: user.id },
        });
        if (!wallet) next();
        else {
          socket.wallet = wallet;
          next();
        }
        const staff = await this.prisma.staff.findFirst({
          where: { userId: user.id },
          select: { business: true, role: true },
        });
        if (!staff) next();
        else {
          socket.business = staff.business;
          // staff.business.
          const businessWallet = await this.prisma.wallet.findFirst({
            where: { businessId: staff.business.id },
          });
          if ((businessWallet && staff.role.name === "owner") || "admin")
            socket.businessWallet = businessWallet;

          next();
        }
      } catch (error) {
        console.log(error);
        next(error);
      }
    });
  }
  handleConnection(client: CustomSocket) {
    let rooms = [`${client.user.id}:notifications`];
    if (client.wallet?.id) rooms.push(`${client.wallet.id}:wallet`);
    if (client.business) {
      // rooms = [`${client.business.id}:business`];
      switch (client.user.role) {
        case "waiter":
          rooms = [];
          rooms.push(
            `${client.user.id}:waiter`,
            `${client.business.id}:business`,
          );
          if (client.wallet?.id) rooms.push(`${client.wallet.id}:wallet`);
          break;
        case "kitchen":
          rooms = [];
          rooms.push(
            `${client.user.id}:kitchen`,
            `${client.business.id}:business`,
          );
          if (client.wallet?.id) rooms.push(`${client.wallet.id}:wallet`);
          break;
        case "owner":
          rooms = [];
          rooms.push(
            `${client.user.id}:owner`,
            `${client.business.id}:business`,
          );
          if (client.businessWallet?.id)
            rooms.push(`${client.businessWallet.id}:wallet`);
          break;
        case "admin":
          rooms = [];
          rooms.push(
            `${client.user.id}:admin`,
            `${client.business.id}:business`,
          );
          if (client.businessWallet?.id)
            rooms.push(`${client.businessWallet.id}:wallet`);
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
      // console.log("Received ping from client");sammyola"1
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
  @SubscribeMessage("mewMessage")
  newMessage(client: CustomSocket, message: string) {
    console.log(message);
  }
  // @SubscribeMessage("ping")
  // pong(client: CustomSocket, callback: any) {
  //   client.emit("pong");
  //   client.emit(callback());
  // }
}
