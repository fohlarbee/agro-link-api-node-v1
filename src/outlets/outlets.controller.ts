/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OutletsService } from './outlets.service';
import { CreateOutletDto } from './dto/create-outlet.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  OutletCreationResponse,
  OutletListResponse,
} from './entities/outlet.entity';
import { CreateTableDto } from './dto/create-table.dto';
import { TableCreationResponse } from './entities/table.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RestaurantAccessInterceptor } from 'src/utils/interceptors/restaurant-access.interceptor';

@Controller('admin/outlets')
@ApiTags('Outlets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiHeader({
  name: 'business_id',
  required: true,
  description: 'This is the business id',
})
@UseInterceptors(RestaurantAccessInterceptor)
export class OutletsController {
  constructor(private readonly outletsService: OutletsService) {}

  @Post()
  @ApiCreatedResponse({ type: OutletCreationResponse })
  createOutlet(
    @Req() request: Record<string, any>,
    @Body() createData: CreateOutletDto,
  ) {
    const { business_id: restaurantId } = request.headers;
    return this.outletsService.createOutlet(+restaurantId, createData);
  }

  @Get()
  @ApiOkResponse({ type: OutletListResponse })
  findOutlets(@Req() request: Record<string, any>) {
    const { business_id: restaurantId } = request.headers;
    return this.outletsService.findOutlets(+restaurantId);
  }

  @Post(':outletId/tables')
  @ApiCreatedResponse({ type: TableCreationResponse })
  createTable(
    @Req() request: Record<string, any>,
    @Body() tableData: CreateTableDto,
  ) {
    const { business_id: restaurantId } = request.headers;
    const { outletId } = request.params;
    return this.outletsService.createTable(+restaurantId, +outletId, tableData);
  }

  @Get(':outletId/tables')
  @ApiOkResponse({ type: OutletListResponse })
  findOutletTables(@Req() request: Record<string, any>) {
    const { business_id: restaurantId } = request.headers;
    const { outletId } = request.params;
    return this.outletsService.GetOutletTables({
      restaurantId: +restaurantId,
      outletId: +outletId,
    });
  }
}
