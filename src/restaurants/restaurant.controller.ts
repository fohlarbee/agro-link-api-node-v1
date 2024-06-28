/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  RestaurantCreationResponse,
  RestaurantListResponse,
} from './entities/restaurant.entity';
import { MenuService } from 'src/menus/menu.service';
import { OrderService } from 'src/orders/order.service';
import { AddMealToOrderDto } from 'src/orders/dto/order-meal.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('restaurant')
@ApiTags('Restaurant')
export class ClientRestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly menuService: MenuService,
    private readonly orderService: OrderService,
  ) {}

  @Get()
  @ApiOkResponse({ type: RestaurantListResponse })
  findAllRestaurants() {
    return this.restaurantService.findAllRestaurants();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantService.findRestaurant(+id);
  }

  @Get(':id/menus')
  findMenus(@Param('id') id: string) {
    return this.menuService.findMenusWithMeals(+id);
  }

  @Post(':id/orders')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createOrder(
    @Param('id') restaurantId: number,
    @Body() createOrderDto: AddMealToOrderDto,
    @Req() request,
  ) {
    const { id: customerId } = request.user;
    return this.orderService.orderMeal(
      createOrderDto,
      +customerId,
      +restaurantId,
    );
  }
}

@Controller('admin/restaurants')
@ApiTags('Restaurants (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AdminRestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @ApiCreatedResponse({ type: RestaurantCreationResponse })
  createRestaurant(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @Req() request,
  ) {
    const { id: creatorId } = request.user;
    return this.restaurantService.createRestaurant(
      createRestaurantDto,
      +creatorId,
    );
  }

  @Get()
  @ApiOkResponse({ type: RestaurantListResponse })
  findMemberRestaurants(@Req() { user: { id: userId } }: Record<string, any>) {
    return this.restaurantService.findStaffRestaurants(userId);
  }

  @Put(':id')
  @ApiOkResponse({ type: RestaurantCreationResponse })
  updateRestaurant(
    @Param('id') restaurantId: string,
    @Req() request: Record<string, any>,
    @Body() updateData: UpdateRestaurantDto,
  ) {
    const { id: userId } = request.user;
    return this.restaurantService.updateRestaurant(
      +restaurantId,
      userId,
      updateData,
    );
  }
}
