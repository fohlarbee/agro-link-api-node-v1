import { Controller, Get, Post, Body, Param, Req, Put, UseGuards } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RoleGuard } from 'src/auth/role/role.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RestaurantCreationResponse, RestaurantListResponse } from './entities/restaurant.entity';

@Controller('restaurant')
@ApiTags('Restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @Roles('vendor')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: RestaurantCreationResponse })
  create(@Body() createRestaurantDto: CreateRestaurantDto, @Req() request) {
    const { id: ownerId } = request.user;
    return this.restaurantService.create(createRestaurantDto, +ownerId);
  }

  @Get()
  @ApiOkResponse({ type: RestaurantListResponse })
  findAll() {
    return this.restaurantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(+id);
  }

  @Put(':id')
  @Roles('vendor')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: RestaurantCreationResponse })
  update(@Param('id') id: string, @Req() { user: { id: ownerId }}: Record<string, any>, @Body() updateData: UpdateRestaurantDto) {
    return this.restaurantService.update(+id, ownerId, updateData);
  }
}
