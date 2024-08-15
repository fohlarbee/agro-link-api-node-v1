import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
  BadRequestException,
  Post,
  Query,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { HttpAuthGuard } from "src/auth/guards/http-auth.guard";
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { ValidPathParamInterceptor } from "src/utils/interceptors/valid-path-param.interceptor";
import { BaseResponse } from "src/app/entities/BaseResponse.entity";
import { Role } from "src/auth/dto/auth.dto";
import RoleGuard from "src/auth/role/role.guard";
import { BusinessAccessInterceptor } from "src/utils/interceptors/business-access-interceptor";
import { FindOpenOrdersResponse } from "./entities/order.entity";
import { DepositInitiationResponse } from "src/wallets/entities/wallets.entity";

@Controller("orders")
@ApiTags("Orders")
@ApiBearerAuth()
@UseGuards(HttpAuthGuard)
@ApiHeader({
  name: "access_token",
  required: true,
  description: "User access token",
})
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiOkResponse({ type: FindOpenOrdersResponse })
  async findOpenOrders(@Req() request) {
    const { id: customerId } = request.user;
    return this.orderService.findCustomerOrders(+customerId);
  }

  @Get("/pay")
  @ApiOkResponse({ type: DepositInitiationResponse })
  @ApiParam({ name: "paymentProvider", example: "PSK", required: true })
  payOrder(@Query("paymentProvider") provider: string, @Req() request) {
    const { id: customerId, email } = request.user;
    const { business_id: businessId } = request.headers;
    return this.orderService.payOrder(
      email,
      customerId,
      +businessId,
      provider.toUpperCase(),
    );
  }

  @Get("/history")
  async findOrderHistory(@Req() request) {
    const { id: customerId } = request.user;
    const history = await this.orderService.findOrderHistory(customerId);
    return {
      message: "Order history fetch successful",
      status: "success",
      data: history,
    };
  }

  @Get("/:id")
  // @UseInterceptors(new ValidPathParamInterceptor())
  async findOrder(@Param("id") orderId: number, @Req() request) {
    const { id: customerId } = request.user;
    return this.orderService.findOrder(customerId, +orderId);
  }

  @Delete(":id/:optionId")
  @UseGuards(RoleGuard([Role.admin, Role.manager]))
  @UseInterceptors(
    new ValidPathParamInterceptor(),
    new ValidPathParamInterceptor("optionId"),
  )
  @ApiAcceptedResponse({ type: BaseResponse })
  remove(
    @Param("id") orderId: number,
    @Param("optionId") optionId: number,
    @Req() request,
  ) {
    const { id: customerId } = request.user;
    if (isNaN(optionId)) throw new BadRequestException("Invalid optionId");
    return this.orderService.removeOptionOrder(
      +optionId,
      +customerId,
      +orderId,
    );
  }
  @Post(":id/active")
  @ApiOkResponse({ type: BaseResponse })
  @UseInterceptors(new ValidPathParamInterceptor())
  async changeOrderToActive(@Param("id") orderId: number, @Req() request: any) {
    const { id: customerId } = request.user;
    const { business_id: businessId } = request.headers;
    return await this.orderService.changeOrdertoActive(
      +customerId,
      +orderId,
      +businessId,
    );
  }
  @Post(":id/accept")
  @UseGuards(RoleGuard([Role.kitchen]))
  @UseInterceptors(BusinessAccessInterceptor)
  @ApiAcceptedResponse({ type: BaseResponse })
  async acceptOrder(@Param("id") orderId: number, @Req() request: any) {
    const { id: kitchenStaffId } = request.user;
    const { business_id: businessId } = request.headers;
    return await this.orderService.acceptOrder(
      +orderId,
      +kitchenStaffId,
      +businessId,
    );
  }

  @Post(":id/ready")
  @UseInterceptors(BusinessAccessInterceptor)
  @UseGuards(RoleGuard([Role.kitchen]))
  @ApiAcceptedResponse({ type: BaseResponse })
  async markOrderAsReady(@Param("id") orderId: number, @Req() request: any) {
    const { id: kitchenStaffId } = request.user;
    const { business_id: businessId } = request.headers;
    return await this.orderService.markOrderAsReady(
      +orderId,
      +kitchenStaffId,
      +businessId,
    );
  }

  @Post(":id/delivered")
  @UseInterceptors(BusinessAccessInterceptor)
  @UseGuards(RoleGuard([Role.waiter]))
  @ApiAcceptedResponse({ type: BaseResponse })
  async markOrderAsDelivered(
    @Param("id") orderId: number,
    @Req() request: any,
  ) {
    const { business_id: businessId } = request.headers;
    const { id: waiterId } = request.user;

    return await this.orderService.markOrderAsDelivered(
      +orderId,
      +waiterId,
      +businessId,
    );
  }

  @Post(":id/complete")
  @UseGuards(RoleGuard([Role.customer]))
  @ApiAcceptedResponse({ type: BaseResponse })
  @ApiHeader({
    name: "business_id",
    required: true,
    description: "THe business Id",
  })
  async markOrderAsComplete(@Param("id") orderId: number, @Req() request: any) {
    const { business_id: businessId } = request.headers;
    const { id: customerId } = request.user;

    return await this.orderService.markOrderAsComplete(
      +orderId,
      +businessId,
      customerId,
    );
  }
}
