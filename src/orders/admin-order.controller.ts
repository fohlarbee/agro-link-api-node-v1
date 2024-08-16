import {
  Controller,
  Get,
  UseGuards,
  Req,
  UseInterceptors,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { HttpAuthGuard } from "src/auth/guards/http-auth.guard";
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger";
import { BusinessAccessInterceptor } from "src/utils/interceptors/business-access-interceptor";
import RoleGuard from "src/auth/role/role.guard";
import { Role } from "src/auth/dto/auth.dto";
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
  @UseGuards(RoleGuard([Role.kitchen, Role.admin, Role.manager]))
  async create(@Req() request) {
    // const { id: ownerId } = request.user;
    // const baseUrl = request.protocol + "://" + request.headers.host;
    // const orders = (await this.orderService.fetchPaidOrders(ownerId, businessId)).map(order => {
    //   order.options.map(orderOPtions => {
    //     orderMeal.option.image = `${baseUrl}/v2/files/image/${orderMeal.option.image}`;
    //   });
    //   return order;
    // });
    const { business_id: businessId } = request.headers;
    const orders = await this.orderService.fetchPaidOrders(+businessId);
    return {
      message: "Orders fetch successful",
      status: "success",
      data: orders,
    };
  }
}
