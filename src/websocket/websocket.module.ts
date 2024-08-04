import { Module } from "@nestjs/common";
import { WebsocketGateway } from "./websocket.gateway";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { WebsocketService } from "./websocket.service";

@Module({
  providers: [JwtService, PrismaService, WebsocketGateway, WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
