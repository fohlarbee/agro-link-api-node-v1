import { Module } from "@nestjs/common";
import { FileUploadController } from "./files.controller";
import { FileUploadService } from "./file-upload.service";

@Module({
  providers: [FileUploadService],
  controllers: [FileUploadController],
  exports: [FileUploadService],
})
export class FilesUploadModule {}
