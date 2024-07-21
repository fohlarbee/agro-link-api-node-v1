import { Module } from "@nestjs/common";
import { OptionsService } from "./options.service";
import {
  AdminOptionsController,
  OptionsController,
} from "./options.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { FilesUploadModule } from "src/files/files.module";
import { FileUploadService } from "src/files/file-upload.service";

@Module({
  imports: [FilesUploadModule],
  exports: [OptionsService],
  controllers: [AdminOptionsController, OptionsController],
  providers: [OptionsService, PrismaService, FileUploadService],
})
export class OptionsModule {}
