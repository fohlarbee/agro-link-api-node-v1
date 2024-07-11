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
@ApiTags(" OptionsController")
export class OptionController {
  constructor(private readonly mealsService: OptionsService) {}

  // @Get()
  // findAll() {
  //   return this.mealsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.mealsService.findOne(+id);
  // }
}

@Controller("admin/options")
@ApiTags("Meals (Admin)")
@ApiHeader({
  name: "business_id",
  required: true,
  description: "This is the business id",
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(BusinessAccessInterceptor)
export class AdminOptionsController {
  constructor(private readonly optionService: OptionsService) {}

  @Post()
  @ApiCreatedResponse()
  createMeal(@Body() createOptionDto: CreateOptionDto, @Req() request) {
    const { business_id } = request.headers;
    return this.optionService.createOption(createOptionDto, +business_id);
  }

  @Get()
  async findAll(@Req() request) {
    const { business_id } = request.headers;
    // const baseUrl = request.protocol + "://" + request.headers.host;
    // const meals = (await this.mealsService.findAll(+business_id)).map(option => {
    //   option.image = `${baseUrl}/v2/files/image/${option.image}`;
    //   return option;
    // });
    const options = await this.optionService.findAll(+business_id);
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
    return this.optionService.update(+id, UpdateOptionDto, +business_id);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() request) {
    const { business_id } = request.headers;
    return this.optionService.remove(+id, +business_id);
  }
}
