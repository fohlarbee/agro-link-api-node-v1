import { Module } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  controllers: [RolesController],
  providers: [PrismaService, RolesService]
})
export class RolesModule {}
