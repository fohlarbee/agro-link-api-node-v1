import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiAcceptedResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ValidPathParamInterceptor } from 'src/utils/interceptors/valid-path-param.interceptor';
import { BaseResponse } from 'src/app/entities/BaseResponse.entity';

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

  @Get('/history')
  async findOrderHistory(@Req() request) {
    const { id: customerId } = request.user;
    const history = await this.orderService.findOrderHistory(customerId);

    return {
      message: 'Order history fetch successful',
      status: 'success',
      data: history,
    };
  }

  @Get('/:id')
  @UseInterceptors(new ValidPathParamInterceptor())
  async findOrder(@Param('id') orderId: number, @Req() request) {
    const { id: customerId } = request.user;
    return this.orderService.findOrder(customerId, +orderId);
  }

  @Delete(':id/:mealId')
  @UseInterceptors(
    new ValidPathParamInterceptor(),
    new ValidPathParamInterceptor('mealId'),
  )
  @ApiAcceptedResponse({ type: BaseResponse })
  remove(
    @Param('id') orderId: number,
    @Param('mealId') mealId: number,
    @Req() request,
  ) {
    const { id: customerId } = request.user;
    if (isNaN(mealId)) throw new BadRequestException('Invalid mealId');
    return this.orderService.removeMealOrder(+mealId, +customerId, +orderId);
  }

  // @Get('/pay')
  // payOrder(@Req() request) {
  //   const { id: customerId, email } = request.user;
  //   const { id: restaurantId } = request.restaurant;
  //   return this.orderService.payOrder(email, customerId, restaurantId);
  // }
}
