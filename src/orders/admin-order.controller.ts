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

  @Get("paid")
  @UseGuards(RoleGuard([Role.attendant, Role.admin]))
  async fetchPaidOrder(@Req() request) {
    const { business_id: businessId } = request.headers;
    const orders = await this.orderService.fetchPaidOrders(+businessId);
    return {
      message: "Orders fetch successful",
      status: "success",
      data: orders,
    };
  }

  @Get("active")
  @UseGuards(RoleGuard([Role.attendant, Role.admin]))
  async fetchActiveOrders(@Req() request) {
    const { business_id: businessId } = request.headers;
    const { id: userId } = request.user;
    const orders = await this.orderService.findOpenBusinessOrder(
      userId,
      +businessId,
    );
    return {
      message: "Order fetch successful",
      status: "success",
      data: orders,
    };
  }
}
