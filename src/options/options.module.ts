import { Module } from "@nestjs/common";
import { OptionsService } from "./options.service";
import { AdminOptionsController, OptionController } from "./options.controller";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  controllers: [AdminOptionsController, OptionController],
  providers: [OptionsService, PrismaService],
})
export class OptionsModule {}
