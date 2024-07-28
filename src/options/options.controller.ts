import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { OptionsService } from "./options.service";
import { CreateOptionDto } from "./dto/create-option.dto";
import { UpdateOptionDto } from "./dto/update-option.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { BusinessAccessInterceptor } from "src/utils/interceptors/business-access-interceptor";
import { ValidPathParamInterceptor } from "src/utils/interceptors/valid-path-param.interceptor";
import { FileInterceptor } from "@nestjs/platform-express";

import {
  storage,
  MAX_IMAGE_SIZE,
  fileFilter,
} from "src/utils/interceptors/file-upload.interceptor";
import RoleGuard from "src/auth/role/role.guard";
import { Role } from "src/auth/dto/auth.dto";

@Controller("options")
@ApiTags(" Options")
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  // @Get()
  // findAll() {
  //   return this.optionsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.optionsService.findOne(+id);
  // }
}

@Controller("admin/options")
@ApiTags("Options (Admin)")
@ApiHeader({
  name: "business_id",
  required: true,
  description: "This is the business id",
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(BusinessAccessInterceptor)
export class AdminOptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Post()
  @UseGuards(RoleGuard([Role.admin, Role.manager]))
  @UseInterceptors(
    FileInterceptor("file", {
      storage,
      fileFilter,
      limits: { fileSize: MAX_IMAGE_SIZE },
    }),
  )
  @ApiCreatedResponse()
  async createOption(
    @UploadedFile() file: Express.Multer.File,
    @Req() request,
    @Body() createOptionDto: CreateOptionDto,
  ) {
    const { business_id } = request.headers;
    return this.optionsService.createOption(
      createOptionDto,
      +business_id,
      file,
    );
  }

  @Get()
  async findAll(@Req() request) {
    const { business_id } = request.headers;
    // const baseUrl = request.protocol + "://" + request.headers.host;
    // const options = (await this.optionsService.findAll(+business_id)).map(option => {
    //   option.image = `${baseUrl}/v2/files/image/${option.image}`;
    //   return option;
    // });
    const options = await this.optionsService.findAll(+business_id);
    return {
      message: "Menu fetch successful",
      status: "success",
      data: options,
    };
  }

  @Put("/:id")
  @UseGuards(RoleGuard([Role.admin, Role.manager, Role.kitchen]))
  @UseInterceptors(new ValidPathParamInterceptor())
  update(
    @Param("id") id: string,
    @Body() createOptionDto: UpdateOptionDto,
    @Req() request,
  ) {
    const { business_id } = request.headers;
    return this.optionsService.update(+id, UpdateOptionDto, +business_id);
  }

  @Delete(":id")
  @UseGuards(RoleGuard([Role.admin, Role.manager, Role.kitchen]))
  @UseGuards(RoleGuard([Role.admin, Role.manager]))
  remove(@Param("id") id: string, @Req() request) {
    const { business_id } = request.headers;
    return this.optionsService.remove(+id, +business_id);
  }
}
