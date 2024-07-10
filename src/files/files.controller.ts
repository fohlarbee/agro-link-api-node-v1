import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags
} from "@nestjs/swagger";
import { FileUploadDto } from "./dto/file.dto";
import * as fs from "fs";
import { diskStorage } from "multer";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const VALID_UPLOADS_MIME_TYPES = ["image/jpeg", "image/png"];
const MIME_TYPE_TO_EXTENSION = {
  "image/jpeg": "jpeg",
  "image/png": "png"
};

@ApiTags("File Management")
@Controller("files")
export class FilesController {
  constructor() {}

  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: MAX_IMAGE_SIZE },
      storage: diskStorage({
        destination: "./uploads/images",
        filename(_req, file, callback) {
          const ext = MIME_TYPE_TO_EXTENSION[file.mimetype];
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 153906).toString(16))
            .join("");
          callback(null, `${randomName}-${Date.now()}.${ext}`);
        }
      }),
      fileFilter(_req, file, callback) {
        if (!VALID_UPLOADS_MIME_TYPES.includes(file.mimetype)) {
          callback(new BadRequestException("Unaccepted file type"), false);
        }
        callback(null, true);
      }
    })
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    description: "Image of Meal",
    type: FileUploadDto
  })
  @ApiCreatedResponse()
  @Post("/upload")
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      message: "Image Upload Successful",
      status: "success",
      data: { image: file.filename }
    };
  }

  @ApiOkResponse()
  @Get("/image/:imageName")
  seeUploadedFile(@Param("imageName") image, @Res() res) {
    if (!fs.existsSync(`./uploads/images/${image}`)) {
      throw new NotFoundException("No such image exists");
    }
    return res.sendFile(image, { root: "./uploads/images" });
  }
}
