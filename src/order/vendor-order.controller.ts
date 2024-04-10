import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, UseInterceptors, BadRequestException } from '@nestjs/common';
import { OrderService } from './order.service';
import { AddMealToOrderDto } from './dto/order-meal.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { HeadersInterceptor } from './interceptors/headers.interceptor';

@Controller('vendor/order')
@Roles("vendor")
@UseGuards(JwtAuthGuard, RoleGuard)
@ApiBearerAuth()
@UseInterceptors(HeadersInterceptor)
export class VendorOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async create(@Req() request) {
    const { id: ownerId } = request.user;
    const { id: restaurantId } = request.restaurant;
    const baseUrl = request.protocol + "://" + request.headers.host;
    const orders = (await this.orderService.fetchPaidOrders(ownerId, restaurantId)).map(order => {
      order.meals.map(orderMeal => {
        orderMeal.meal.image = `${baseUrl}/v2/files/image/${orderMeal.meal.image}`;
      });
      return order;
    });

    return {
      message: "Orders fetch successful", status: "success", data: orders
    };
  }
}
