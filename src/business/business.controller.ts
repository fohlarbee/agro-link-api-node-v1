import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Put,
  UseGuards,
  Query,
} from "@nestjs/common";
import { BusinessService } from "./business.service";
import { CreateBusinessDto } from "./dto/create-business.dto";
import { UpdateBusinessDto } from "./dto/updateBusinessDto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import {
  BusinessCreationResponse,
  BusinessListResponse,
} from "./entities/business.entity";
import { MenuService } from "src/menus/menu.service";
import { OrderService } from "src/orders/order.service";
import { OrderDto } from "src/orders/dto/order-option.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Role } from "src/auth/dto/auth.dto";
import RoleGuard from "src/auth/role/role.guard";

@Controller("business")
@ApiTags("Business")
export class ClientBusinessController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly menuService: MenuService,
    private readonly orderService: OrderService,
  ) {}

  @Get()
  @ApiOkResponse({ type: BusinessListResponse })
  findAllBusinesses() {
    return this.businessService.findAllBusinesses();
  }
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.businessService.findBusiness(+id);
  }

  @Get(":id/menus")
  findMenus(@Param("id") id: string) {
    return this.menuService.findMenusWithOptions(+id);
  }

  @Post(":id/orders")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createOrder(
    @Param("id") businessId: number,
    @Body() createOrderDto: any,
    @Req() request,
  ) {
    const { id: customerId } = request.user;
    return this.orderService.orderOption(
      createOrderDto,
      +customerId,
      +businessId,
    );
  }
}

@Controller("admin/businesses")
@ApiTags("Business (Admin)")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
// @Roles(Role.admin)
export class AdminBusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @UseGuards(RoleGuard([Role.owner, Role.admin, Role.manager]))
  @ApiCreatedResponse({ type: BusinessCreationResponse })
  createBusiness(@Body() createBusinessDto: CreateBusinessDto, @Req() request) {
    const { id: creatorId } = request.user;
    return this.businessService.createBusiness(createBusinessDto, +creatorId);
  }

  @Get()
  @UseGuards(RoleGuard([Role.admin]))
  @ApiOkResponse({ type: BusinessListResponse })
  findMemberBusinesses(@Req() { user: { id: userId } }: Record<string, any>) {
    return this.businessService.findStaffBusiness(userId);
  }

  @Put(":id")
  @UseGuards(RoleGuard([Role.admin, Role.owner, Role.manager]))
  @ApiOkResponse({ type: BusinessCreationResponse })
  updateBusiness(
    @Param("id") businessId: string,
    @Req() request: Record<string, any>,
    @Body() updateData: UpdateBusinessDto,
  ) {
    const { id: userId } = request.user;
    return this.businessService.updateBusiness(+businessId, userId, updateData);
  }

  @ApiBearerAuth()
  @ApiQuery({})
  @Get(":id/analytics")
  @UseGuards(RoleGuard([Role.admin, Role.owner, Role.manager]))
  async getBusinessAnalytic(
    @Param("id") businessId: string,
    @Query("page") page: any = 1,
    @Query("perPage") perPage: any = 10,
    @Query("sortBy") sortBy?: string,
  ) {
    const result = await this.businessService.findBusinessWithRelations(
      +businessId,
      page,
      perPage,
      sortBy,
    );

    return {
      data: result,
    };
  }
}
