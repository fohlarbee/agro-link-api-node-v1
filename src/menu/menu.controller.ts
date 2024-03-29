import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put, BadRequestException } from '@nestjs/common';
import { MenuService } from './menu.service';
import { AddMealDto } from './dto/add-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { Roles } from 'src/auth/roles/roles.decorator';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post('/add')
  @Roles('vendor')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse()
  create(@Body() addMealDto: AddMealDto, @Req() request) {
    const { id: ownerId } = request.user;
    return this.menuService.create(addMealDto, +ownerId);
  }

  @Get('/:restaurantId')
  async findAll(@Param("restaurantId") restaurantId: number, @Req() request) {
    if (isNaN(restaurantId)) throw new BadRequestException("Invalid restaurant id");
    const baseUrl = request.protocol + "://" + request.headers.host;
    const menu = (await this.menuService.findAll(+restaurantId)).map(meal => {
      meal.image = `${baseUrl}/v2/files/image/${meal.image}`;
      return meal;
    });
    return {
      message: "Menu fetch successful",
      status: "success", data: { menu }
    };
  }

  @Put('/meal/:id')
  @Roles('vendor')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateMealDto: UpdateMealDto, @Req() request) {
    const { id: ownerId } = request.user;
    return this.menuService.update(+id, updateMealDto, +ownerId);
  }

  @Delete(':id')
  @Roles('vendor')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string, @Req() request) {
    const { id: ownerId } = request.user;
    return this.menuService.remove(+id, +ownerId);
  }
}
