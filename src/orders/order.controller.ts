import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('orders')
@ApiTags('Orders')
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
  async findOrder(@Param('id') orderId: number, @Req() request) {
    const { id: customerId } = request.user;
    return this.orderService.findOrder(customerId, +orderId);
  }

  @Get('/history')
  async findOrderHistory(@Req() request) {
    const { id: customerId } = request.user;
    // const baseUrl = request.protocol + "://" + request.headers.host;
    // const history = (await this.orderService.findOrderHistory(customerId)).map(order => {
    //   order.meals.map(orderMeal => {
    //     orderMeal.option.image = `${baseUrl}/v2/files/image/${orderMeal.option.image}`;
    //     return { ...orderMeal.option, quantity: orderMeal.quantity};
    //   });
    //   return order;
    // });

    const history = await this.orderService.findOrderHistory(customerId);

    return {
      message: 'Order history fetch successful',
      status: 'success',
      data: history,
    };
  }

  @Delete(':id/:optionId')
  remove(
    @Param('id') orderId: number,
    @Param('optionId') optionId: number,
    @Req() request,
  ) {
    const { id: customerId } = request.user;
    if (isNaN(optionId)) throw new BadRequestException('Invalid optionId');
    return this.orderService.removeMealOrder(+optionId, +customerId, +orderId);
  }

  @Get('/pay')
  payOrder(@Req() request) {
    const { id: customerId, email } = request.user;
    const { id: businessId } = request.business;
    return this.orderService.payOrder(email, customerId, businessId);
  }
}
