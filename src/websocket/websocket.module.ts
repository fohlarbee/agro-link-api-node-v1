import { Module } from "@nestjs/common";
import { WebsocketGateway } from "./websocket.gateway";
import { JwtModule } from "@nestjs/jwt";
import { WebsocketService } from "./websocket.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_DURATION },
      }),
    }),
    PrismaModule
  ],
  providers: [WebsocketGateway, WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
