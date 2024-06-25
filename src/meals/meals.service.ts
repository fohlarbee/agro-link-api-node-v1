import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMealDto } from './dto/create-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import * as fs from 'fs';

@Injectable()
export class MealsService {
  constructor(private prisma: PrismaService) {}

  async createMeal(mealData: CreateMealDto, restaurantId: number) {
    // if (!fs.existsSync(`./uploads/images/${mealData.image}`)) throw new BadRequestException(`Unknown image file ${mealData.image}`);
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id: restaurantId }});
    if (!restaurant) throw new NotFoundException("Invalid restaurant");
    await this.prisma.meal.create({
      data: { ...mealData, restaurantId }
    });
    return { message: "Meal successfully created", status: "success" };
  }

  async findAll(restaurantId: number) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });
    if (!restaurant) throw new NotFoundException(`No restaurant with id ${restaurantId}`)
    const meals = await this.prisma.meal.findMany({
      where: { restaurantId },
      select: { name: true, id: true, price: true, image: true }
    });
    return meals;
  }

  async update(id: number, updateMealData: UpdateMealDto, restaurantId: number) {
    if (updateMealData.image && !fs.existsSync(`./uploads/images/${updateMealData.image}`)) throw new BadRequestException(`Unknown image file ${updateMealData.image}`);
    const restaurant = await this.prisma.restaurant.findUnique({ where: { id: restaurantId }});
    if (!restaurant) throw new NotFoundException("Invalid restaurant");
    const meal = await this.prisma.meal.findUnique({
      where: { id, restaurantId: restaurant.id }
    });
    if (!meal) throw new NotFoundException("No such meal in restaurant menu");
    await this.prisma.meal.update({
      where: { id },
      data: updateMealData
    });
    if (updateMealData.image && meal.image != updateMealData.image) await this.deleteImageFile(meal.image);
    return { message: "Meal update successful", status: "success" };
  }

  async remove(id: number, restaurantId: number) {
    const meal = await this.prisma.meal.findUnique({
      where: { id, restaurantId }
    });
    if (!meal) throw new NotFoundException("Restaurant has no such meal");
    await this.prisma.meal.delete({ where: { id }});
    await this.deleteImageFile(meal.image);
    return { message: "Meal delete successful", status: "success" };
  }

  private async deleteImageFile(filename: string) {
    const imageUseCount = await this.prisma.meal.count({
      where: { image: filename }
    });
    if (imageUseCount < 1) fs.rmSync(`./uploads/images/${filename}`, { force: true });
  }
}
