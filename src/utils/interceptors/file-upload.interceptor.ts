import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Observable, catchError } from "rxjs";
import { v2 as cloudinary } from "cloudinary";
import { diskStorage } from "multer";
import * as fs from "fs";

const { CLOUDINARY_API_KEY, CLOUDINARY_BUCKET_NAME, CLOUDINARY_SECRET_KEY } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_BUCKET_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET_KEY,
  secure: true,
});

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { fileValidationError, file } = request;
    if (fileValidationError) throw fileValidationError;
    if (!file) throw new BadRequestException("No file uploaded");
    try {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "uploads",
      });
      request.body.imageURL = uploadResult?.secure_url;
      fs.unlinkSync(file.path);
    } catch (error) {
      console.log("Cloudinary Upload error", error);
      throw new InternalServerErrorException(
        `Currently unable to upload image.`,
      );
    }

    return next.handle().pipe(
      catchError((error) => {
        throw error;
      }),
    );
  }
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const VALID_UPLOADS_MIME_TYPES = ["image/jpeg", "image/png"];
const MIME_TYPE_TO_EXTENSION = {
  "image/jpeg": "jpeg",
  "image/png": "png",
};

export const parseFileInterceptor = FileInterceptor("file", {
  limits: { fileSize: MAX_IMAGE_SIZE },
  fileFilter(_req, file, callback) {
    if (!VALID_UPLOADS_MIME_TYPES.includes(file.mimetype)) {
      return callback(new BadRequestException("Unaccepted file type"), false);
    }
    callback(null, true);
  },
  storage: diskStorage({
    destination: "./uploads/images",
    filename(_req, file, callback) {
      const ext = MIME_TYPE_TO_EXTENSION[file.mimetype];
      const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 153906).toString(16))
        .join("");
      callback(
        null,
        ext ? `${randomName}-${Date.now()}.${ext}` : file.filename,
      );
    },
  }),
});
