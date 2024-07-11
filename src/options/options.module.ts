import { Module } from "@nestjs/common";
import { OptionsService } from "./options.service";
import {
  AdminOptionsController,
  OptionsController,
} from "./options.controller";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  controllers: [AdminOptionsController, OptionsController],
  providers: [OptionsService, PrismaService],
})
export class OptionsModule {}
