import { Module } from "@nestjs/common";
import { FileUploadService } from "./file-upload.service";

@Module({
  providers: [FileUploadService],
  controllers: [],
  exports: [FileUploadService],
})
export class FilesUploadModule {}
