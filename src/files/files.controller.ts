import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadDto } from './dto/file.dto';
import {
  FileUploadInterceptor,
  parseFileInterceptor,
} from 'src/utils/interceptors/file-upload.interceptor';

@ApiTags('File Management')
@Controller('files')
export class FilesController {
  constructor() {}

  @UseInterceptors(parseFileInterceptor, FileUploadInterceptor)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image of Option',
    type: FileUploadDto,
  })
  @ApiCreatedResponse()
  @Post('/upload')
  uploadFile(@Body() body) {
    return {
      message: 'Image Upload Successful',
      status: 'success',
      data: { image: body.imageURL },
    };
  }
}
