import {
  Controller,
  Get,
  UseGuards,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { HttpAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger";
import { BusinessAccessInterceptor } from "src/utils/interceptors/business-access-interceptor";
@Controller("admin/orders")
@ApiTags("Orders (Admin)")
@ApiBearerAuth()
@UseGuards(HttpAuthGuard)
@ApiHeader({
  name: "business_id",
  required: true,
  description: "This is the business id",
})
@UseInterceptors(BusinessAccessInterceptor)
export class AdminOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async create(@Req() request) {
    const { id: ownerId } = request.user;
    const { business_id: businessId } = request.headers;
    // const baseUrl = request.protocol + "://" + request.headers.host;
    // const orders = (await this.orderService.fetchPaidOrders(ownerId, businessId)).map(order => {
    //   order.options.map(orderOPtions => {
    //     orderMeal.option.image = `${baseUrl}/v2/files/image/${orderMeal.option.image}`;
    //   });
    //   return order;
    // });
    const orders = await this.orderService.fetchPaidOrders(
      ownerId,
      +businessId,
    );

    return {
      message: "Orders fetch successful",
      status: "success",
      data: orders,
    };
  }
}
