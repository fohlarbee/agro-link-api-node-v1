import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, UseInterceptors, BadRequestException } from '@nestjs/common';
import { OrderService } from './order.service';
import { AddMealToOrderDto } from './dto/order-meal.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { HeadersInterceptor } from './interceptors/headers.interceptor';

@Controller('order')
@UseInterceptors(HeadersInterceptor)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles("customer")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  create(@Body() createOrderDto: AddMealToOrderDto, @Req() request) {
    const { id: customerId } = request.user;
    const { id: restaurantId } = request.restaurant;
    return this.orderService.orderMeal(createOrderDto, customerId, restaurantId);
  }

  @Get()
  @Roles("customer")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  async findOrder(@Req() request) {
    const { id: customerId } = request.user;
    const { id: restaurantId } = request.restaurant;
    const baseUrl = request.protocol + "://" + request.headers.host;
    const meals = (await this.orderService.findCurrentOrder(customerId, restaurantId)).map(orderMeal => {
      orderMeal.meal.image = `${baseUrl}/v2/files/image/${orderMeal.meal.image}`;
      return { ...orderMeal.meal, quantity: orderMeal.quantity};
    });
    return {
      message: "Order fetch successful",
      status: "success", data: meals
    };
  }

  @Get('/history')
  @Roles("customer")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  async findOrderHistory(@Req() request) {
    const { id: customerId } = request.user;
    const { id: restaurantId } = request.restaurant;
    const baseUrl = request.protocol + "://" + request.headers.host;
    const history = (await this.orderService.findOrderHistory(customerId, restaurantId)).map(order => {
      order.meals.map(orderMeal => {
        orderMeal.meal.image = `${baseUrl}/v2/files/image/${orderMeal.meal.image}`;
        return { ...orderMeal.meal, quantity: orderMeal.quantity};
      });
      return order;
    });
    return {
      message: "Order history fetch successful",
      status: "success", data: history
    };
  }

  @Delete(':mealId')
  @Roles("customer")
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  remove(@Param('mealId') mealId: number,  @Req() request) {
    const { id: customerId } = request.user;
    const { id: restaurantId } = request.restaurant;
    if (isNaN(mealId)) throw new BadRequestException("Invalid mealId");
    return this.orderService.removeMealOrder(+mealId, customerId, restaurantId);
  }
}
