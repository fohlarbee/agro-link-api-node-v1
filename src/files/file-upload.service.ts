import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import * as fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_BUCKET_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true,
});
@Injectable()
export class FileUploadService {
  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "uploads",
      });
      fs.unlinkSync(file.path);
      return uploadResult.secure_url;
    } catch (error) {
      console.log("Cloudinary Upload error", error);
      throw new InternalServerErrorException(
        `Currently unable to upload image.`,
      );
    }
  }
}
