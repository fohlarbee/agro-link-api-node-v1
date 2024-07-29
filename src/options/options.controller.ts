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
import {
  parseFileInterceptor,
  FileUploadInterceptor,
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
  @UseInterceptors(parseFileInterceptor, FileUploadInterceptor)
  @ApiCreatedResponse()
  async createOption(@Req() request, @Body() body: Record<string, any>) {
    const { name, price, type, imageURL: avatar } = body;
    const { business_id } = request.headers;
    return this.optionsService.createOption(
      name,
      +price,
      type,
      avatar,
      +business_id,
    );
  }

  @Get()
  async findAll(@Req() request) {
    const { business_id } = request.headers;
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
