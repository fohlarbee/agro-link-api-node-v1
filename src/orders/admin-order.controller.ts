import {
  Controller,
  Get,
  UseGuards,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { RestaurantAccessInterceptor } from 'src/utils/interceptors/restaurant-access.interceptor';

@Controller('admin/orders')
@ApiTags('Orders (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiHeader({
  name: 'business_id',
  required: true,
  description: 'This is the business id',
})
@UseInterceptors(RestaurantAccessInterceptor)
export class AdminOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async create(@Req() request) {
    const { id: ownerId } = request.user;
    const { business_id: restaurantId } = request.headers;
    // const baseUrl = request.protocol + "://" + request.headers.host;
    // const orders = (await this.orderService.fetchPaidOrders(ownerId, restaurantId)).map(order => {
    //   order.meals.map(orderMeal => {
    //     orderMeal.meal.image = `${baseUrl}/v2/files/image/${orderMeal.meal.image}`;
    //   });
    //   return order;
    // });
    const orders = await this.orderService.fetchPaidOrders(
      ownerId,
      +restaurantId,
    );

    return {
      message: 'Orders fetch successful',
      status: 'success',
      data: orders,
    };
  }
}
