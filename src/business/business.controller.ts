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
import { AddOptionToOrderDto } from "src/orders/dto/order-option.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
  
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
    @Body() createOrderDto: AddOptionToOrderDto,
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
export class AdminBusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @ApiCreatedResponse({ type: BusinessCreationResponse })
  createBusiness(@Body() createBusinessDto: CreateBusinessDto, @Req() request) {
    const { id: creatorId } = request.user;
    return this.businessService.createBusiness(createBusinessDto, +creatorId);
  }

  @Get()
  @ApiOkResponse({ type: BusinessListResponse })
  findMemberBusinesses(@Req() { user: { id: userId } }: Record<string, any>) {
    return this.businessService.findStaffBusiness(userId);
  }

  @Put(":id")
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
  @Get(":id/analytic")
  async getBusinessAnalytic(
    @Param("id") businessId: string,
    @Query("page") page: any = 1,
    @Query("perPage") perPage: any = 10,
    @Query("sortBy") sortBy?: string,
    // @Query("filter") filter?: string,
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
