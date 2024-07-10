import { Module } from "@nestjs/common";
import { OptionService } from "./options.service";
import { AdminOptionsController, OptionController } from "./options.controller";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  controllers: [AdminOptionsController, OptionController],
  providers: [OptionService, PrismaService]
})
export class OptionsModule {}
