import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as fs from "fs";
import { FileUploadService } from "./file-upload.service";

const storage = diskStorage({
  destination: "./uploads/images",
  filename(_req, file, callback) {
    const ext = file.mimetype.split("/")[1];
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 153906).toString(16))
      .join("");
    callback(null, `${randomName}-${Date.now()}.${ext}`);
  },
});

const fileFilter = (_req, file, callback) => {
  if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
    return callback(new BadRequestException("Unaccepted file type"), false);
  }
  callback(null, true);
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

@Controller("files")
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post("/uploadfile")
  @UseInterceptors(
    FileInterceptor("file", {
      storage,
      fileFilter,
      limits: { fileSize: MAX_IMAGE_SIZE },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const imageUrl = await this.fileUploadService.uploadFile(file);
    return {
      message: "Image Upload Successful",
      status: "success",
      data: { image: imageUrl },
    };
  }
}
