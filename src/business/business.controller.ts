
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/updateBusinessDto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BusinessCreationResponse,
  BusinessListResponse,
} from './entities/business.entity';
import { MenuService } from 'src/menus/menu.service';
import { OrderService } from 'src/orders/order.service';
import { AddOptionToOrderDto } from 'src/orders/dto/order-option.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('business')
@ApiTags('Business')
export class ClienBusinessController {
  constructor(
    private readonly businessService: BusinessService,
    private readonly menuService: MenuService,
    private readonly orderService: OrderService,
  ) {}

  @Get()
  @ApiOkResponse({ type: BusinessListResponse })
  findAllRestaurants() {
    return this.businessService.findAllBusinesses();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessService.findBusiness(+id);
  }

  @Get(':id/menus')
  findMenus(@Param('id') id: string) {
    return this.menuService.findMenusWithMeals(+id);
  }

  @Post(':id/orders')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  createOrder(
    @Param('id') businessId: number,
    @Body() createOrderDto: AddOptionToOrderDto,
    @Req() request,
  ) {
    const { id: customerId } = request.user;
    return this.orderService.orderMeal(
      createOrderDto,
      +customerId,
      +businessId,
    );
  }
}

@Controller('admin/businesses')
@ApiTags('Business (Admin)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class AdminBusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @ApiCreatedResponse({ type: BusinessCreationResponse })
  creatwBusiness(
    @Body() createBusinessDto: CreateBusinessDto,
    @Req() request,
  ) {
    const { id: creatorId } = request.user;
    return this.businessService.createBusiness(
      createBusinessDto,
      +creatorId,
    );
  }

  @Get()
  @ApiOkResponse({ type: BusinessListResponse })
  findMemberRestaurants(@Req() { user: { id: userId } }: Record<string, any>) {
    console.log(userId)
    return this.businessService.findStaffBusiness(userId);
  }

  @Put(':id')
  @ApiOkResponse({ type: BusinessCreationResponse })
  updateRestaurant(
    @Param('id') businessId: string,
    @Req() request: Record<string, any>,
    @Body() updateData: UpdateBusinessDto,
  ) {
    const { id: userId } = request.user;
    return this.businessService.updateBusiness(
      +businessId,
      userId,
      updateData,
    );
  }
}
