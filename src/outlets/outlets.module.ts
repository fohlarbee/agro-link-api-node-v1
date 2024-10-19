import { Module } from "@nestjs/common";
import { OutletsService } from "./outlets.service";
import { OutletsController } from "./outlets.controller";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  controllers: [OutletsController],
  providers: [OutletsService, PrismaService],
})
export class OutletsModule {}
