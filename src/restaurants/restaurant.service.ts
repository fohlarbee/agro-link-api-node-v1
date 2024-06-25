import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOutletDto } from '../outlets/dto/create-outlet.dto';
import { CreateTableDto } from '../outlets/dto/create-table.dto';

@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  // Client methods
  async findAllRestaurants() {
    const restaurants = await this.prisma
      .restaurant
      .findMany({
        select: {
          name: true, id: true,
          phoneNumber: true
        }
      });
    
    return {
      message: "Restaurants fetched successfully",
      status: "success", data: restaurants
    };
  }

  async findRestaurant(id: number) {
    const restaurant = await this.prisma
      .restaurant
      .findUnique({ where: { id }});
    
    if (!restaurant) throw new NotFoundException({
      message: `No such restaurant with id ${id}`,
      status: 'error'
    });

    return {
      message: "Restaurant fetch successful",
      status: "success", data: { restaurant }
    };
  }

  // Admin methods

  async createRestaurant(createData: CreateRestaurantDto, creatorId: number) {
    const restaurant = await this.prisma
      .restaurant
      .create({
        data: { ...createData, creatorId }
      });
    
    await this.prisma
      .staff
      .create({
        data: { 
          restaurant: { connect: { id: restaurant.id  } }, 
          user: { connect: { id: creatorId }},
          role: { create: { 
            name: "owner", restaurantId: restaurant.id  as unknown as number
          }},
        }
      });

    return {
      message: "Restaurant created successfully.",
      status: "success", data: { restaurant }
    };
  }

  async findStaffRestaurants(userId: number) {
    const restaurants = await this.prisma
      .staff
      .findMany({
        where: { userId },
        select: {
          restaurant: { 
            select: {
              name: true, id: true,
            }
          },
          role: { select: { name: true } },
        }
      });
    
    return {
      message: "Restaurants fetched successfully",
      status: "success", data: restaurants
    };
  }

  async updateRestaurant(id: number, userId: number, updateData: UpdateRestaurantDto) {
    let restaurant = await this.prisma
      .restaurant
      .findUnique({ 
        where: { 
          id, staffs: { some: { userId, role: { name: "owner "} }},
        }
      });
    if (!restaurant) throw new ForbiddenException({
      message: `Unauthorised edit of restaurant`,
      status: "error"
    });
    restaurant = await this.prisma
      .restaurant
      .update({
        where: { id }, data: updateData
      });

    return {
      message: "Restaurant update successful",
      status: "success", data: { restaurant }
    };
  }
}
