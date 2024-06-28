/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseInterceptors,
  UseGuards,
  Param,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateMenuDto } from './dto/create-menu.dto';
import { mealIdsDto } from './dto/meal-ids.dto';
import { BaseResponse } from 'src/app/entities/BaseResponse.entity';
import { RestaurantAccessInterceptor } from 'src/utils/interceptors/restaurant-access.interceptor';

@Controller('admin/menus')
@ApiTags('Menus')
@ApiHeader({
  name: 'business_id',
  required: true,
  description: 'This is the business id',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(RestaurantAccessInterceptor)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiCreatedResponse()
  createMenu(@Body() { name }: CreateMenuDto, @Req() request) {
    const { business_id } = request.headers;
    return this.menuService.createMenu({ name, restaurantId: +business_id });
  }

  @Get()
  @ApiOkResponse({})
  async findAll(@Req() request) {
    const { business_id } = request.headers;
    return this.menuService.findAllMenus(+business_id);
  }

  @Post(':id/add-meals')
  @ApiOkResponse({ type: BaseResponse })
  async assignMeals(
    @Param('id') mealId: number,
    @Body() { mealIds }: mealIdsDto,
    @Req() request,
  ) {
    const { business_id } = request.headers;
    return this.menuService.addMenuMeals(+business_id, +mealId, mealIds);
  }

  @Post(':id/remove-meals')
  @ApiOkResponse({ type: BaseResponse })
  async removeMeals(
    @Param('id') mealId: number,
    @Body() { mealIds }: mealIdsDto,
    @Req() request,
  ) {
    const { business_id } = request.headers;
    return this.menuService.removeMenuMeals(+business_id, +mealId, mealIds);
  }
}
