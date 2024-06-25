import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, UseInterceptors, BadRequestException } from '@nestjs/common';
import { OrderService } from './order.service';
import { AddMealToOrderDto } from './dto/order-meal.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { HeadersInterceptor } from './interceptors/headers.interceptor';

@Controller('orders')
@ApiTags("Orders")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async findOpenOrders(@Req() request) {
    const { id: customerId } = request.user;
    return this.orderService.findCustomerOrders(+customerId);
  }

  @Get('/:id')
  async findOrder(@Param('id') orderId: number,  @Req() request) {
    const { id: customerId } = request.user;
    return this.orderService.findOrder(customerId, +orderId);
  }

  @Get('/history')
  async findOrderHistory(@Req() request) {
    const { id: customerId } = request.user;
    // const baseUrl = request.protocol + "://" + request.headers.host;
    // const history = (await this.orderService.findOrderHistory(customerId)).map(order => {
    //   order.meals.map(orderMeal => {
    //     orderMeal.meal.image = `${baseUrl}/v2/files/image/${orderMeal.meal.image}`;
    //     return { ...orderMeal.meal, quantity: orderMeal.quantity};
    //   });
    //   return order;
    // });

    const history = await this.orderService.findOrderHistory(customerId);
    
    return {
      message: "Order history fetch successful",
      status: "success", data: history
    };
  }

  @Delete(':id/:mealId')
  remove(@Param('id') orderId: number, @Param('mealId') mealId: number, @Req() request) {
    const { id: customerId } = request.user;
    if (isNaN(mealId)) throw new BadRequestException("Invalid mealId");
    return this.orderService.removeMealOrder(+mealId, +customerId, +orderId);
  }

  @Get("/pay")
  payOrder(@Req() request){
    const { id: customerId, email } = request.user;
    const { id: restaurantId } = request.restaurant;
    return this.orderService.payOrder(email, customerId, restaurantId);
  }
}
