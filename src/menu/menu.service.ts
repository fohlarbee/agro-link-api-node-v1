import { BadRequestException, Injectable, NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { AddMealDto } from './dto/add-meal.dto';
import { UpdateMealDto } from './dto/update-meal.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';

@Injectable()
export class MenuService {

  constructor(private prisma: PrismaService) {}
  async create(mealData: AddMealDto, ownerId: number) {
    if (!fs.existsSync(`./uploads/images/${mealData.image}`)) throw new BadRequestException(`Unknown image file ${mealData.image}`);
    const restaurant = await this.prisma.restaurant.findUnique({ where: { ownerId }});
    if (!restaurant) throw new PreconditionFailedException("Please create a restaurant");
    const menu = await this.findOrCreateMenu(restaurant.id);
    await this.prisma.meal.create({
      data: { ...mealData, menuId: menu.id }
    });
    return { message: "Meal successfully added to menu", status: "success" };
  }

  private async findOrCreateMenu(restaurantId: number) {
    const  menu = await this.prisma.menu.findFirst({
      where: { restaurantId }
    });
    if (menu) return menu;
    return this.prisma.menu.create({
      data: { restaurantId }
    });
  }

  async findAll(restaurantId: number) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });
    if (!restaurant) throw new NotFoundException(`No restaurant with id ${restaurantId}`)
    const menu = await this.prisma.meal.findMany({
      where: { menu: { restaurantId }},
      select: { name: true, id: true, price: true, image: true }
    });
    return menu
  }

  async update(id: number, updateMealData: UpdateMealDto, ownerId: number) {
    if (updateMealData.image && !fs.existsSync(`./uploads/images/${updateMealData.image}`)) throw new BadRequestException(`Unknown image file ${updateMealData.image}`);
    const restaurant = await this.prisma.restaurant.findUnique({ where: { ownerId }});
    if (!restaurant) throw new NotFoundException("No such meal in restaurant menu");
    const meal = await this.prisma.meal.findUnique({
      where: { id, menu: { restaurantId: restaurant.id }}
    });
    if (!meal) throw new NotFoundException("No such meal in restaurant menu");
    await this.prisma.meal.update({
      where: { id },
      data: updateMealData
    });
    if (updateMealData.image && meal.image != updateMealData.image) await this.deleteImageFile(meal.image);
    return { message: "Meal update successful", status: "success" };
  }

  async remove(id: number, ownerId: number) {
    const meal = await this.prisma.meal.findUnique({
      where: { id, menu: { restaurant: { ownerId }}}
    });
    if (!meal) throw new NotFoundException("No such meal in restaurant menu");
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
