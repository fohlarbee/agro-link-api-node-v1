import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  async create(createData: CreateRestaurantDto, ownerId: number) {
    let restaurant = await this.prisma.restaurant.findUnique({ where: { ownerId }});
    if (restaurant) throw new BadRequestException({
      status: "error",
      message: "You already have a business.",
    });

    restaurant = await this.prisma.restaurant.create({
      data: { ...createData, ownerId }
    });

    return {
      message: "Restaurant created successfully.",
      status: "success", data: { restaurant }
    };
  }

  async findAll() {
    const restaurants = await this.prisma.restaurant.findMany({
      select: {
        name: true, address: true, id: true, phoneNumber: true
      }
    });
    return {
      message: "Restaurants are fetched successfully",
      status: "success", data: restaurants
    };
  }

  async findOne(id: number) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id }
    });
    if (!restaurant) throw new NotFoundException({
      message: `No such restaurant with id ${id}`,
      status: 'error'
    });
    return {
      message: "Restaurant fetch successful",
      status: "success", data: { restaurant }
    };
  }

  async update(id: number, ownerId: number, updateData: UpdateRestaurantDto) {
    let restaurant = await this.prisma.restaurant.findUnique({ where: { id, ownerId }});
    if (!restaurant) throw new ForbiddenException({
      message: `Unauthorised edit of restaurant`,
      status: "error"
    });
    restaurant = await this.prisma.restaurant.update({
      where: { id }, data: updateData
    });

    return {
      message: "Restaurant update successful",
      status: "success", data: { restaurant }
    };
  }
}
