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
// import { Bus } from 'src/utils/interceptors/business-access.interceptor';

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
  @ApiCreatedResponse()
  createOption(@Body() createOptionDto: CreateOptionDto, @Req() request) {
    const { business_id } = request.headers;
    return this.optionsService.createOption(createOptionDto, +business_id);
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
  update(
    @Param("id") id: string,
    @Body() createOptionDto: UpdateOptionDto,
    @Req() request,
  ) {
    const { business_id } = request.headers;
    return this.optionsService.update(+id, UpdateOptionDto, +business_id);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() request) {
    const { business_id } = request.headers;
    return this.optionsService.remove(+id, +business_id);
  }
}
