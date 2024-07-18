import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseInterceptors,
  UseGuards,
  Param,
} from "@nestjs/common";
import { MenuService, MenuTypes } from "./menu.service";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { optionIdsDto } from "./dto/option-ids.dto";
import { BaseResponse } from "src/app/entities/BaseResponse.entity";
import { BusinessAccessInterceptor } from "src/utils/interceptors/business-access-interceptor";

@Controller("admin/menus")
@ApiTags("Menus")
@ApiHeader({
  name: "business_id",
  required: true,
  description: "This is the business id",
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(BusinessAccessInterceptor)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiCreatedResponse()
  createMenu(
    @Body() { name }: CreateMenuDto,
    @Req() request,
    menuType: MenuTypes,
  ) {
    const { business_id } = request.headers;

    return this.menuService.createMenu({
      name,
      businessId: +business_id,
      menuType,
    });
  }

  @Get()
  @ApiOkResponse({})
  async findAll(@Req() request) {
    const { business_id } = request.headers;
    return this.menuService.findAllMenus(+business_id);
  }

  @Post(":id/add-options")
  @ApiOkResponse({ type: BaseResponse })
  async assignOptions(
    @Param("id") optionId: number,
    @Body() { optionIds }: optionIdsDto,
    @Req() request,
  ) {
    const { business_id } = request.headers;
    return this.menuService.addMenuOptions(+business_id, +optionId, optionIds);
  }

  @Post(":id/remove-options")
  @ApiOkResponse({ type: BaseResponse })
  async removeOptions(
    @Param("id") optionId: number,
    @Body() { optionIds }: optionIdsDto,
    @Req() request,
  ) {
    const { business_id } = request.headers;
    return this.menuService.removeMenuOptions(
      +business_id,
      +optionId,
      optionIds,
    );
  }
}
