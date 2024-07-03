/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateMealDto } from '../meals/dto/create-meal.dto';
import { UpdateMealDto } from '../meals/dto/update-meal.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async createMenu({
    name,
    businessId,
  }: {
    name: string;
    businessId: number;
  }) {
    await this.isValidRestaurant(businessId);
    const menu = await this.prisma.menu.create({
      data: { businessId, name },
      select: { id: true, name: true },
    });
    return {
      message: 'Menu successfully created',
      status: 'success',
      data: { menu },
    };
  }

  private async isValidRestaurant(businessId: number) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business)
      throw new NotFoundException(`No business with id ${businessId}`);
  }

  async findAllMenus(businessId: number) {
    await this.isValidRestaurant(businessId);
    const menus = await this.prisma.menu.findMany({
      where: { businessId },
      select: { id: true, name: true },
    });

    return {
      message: 'Menus fetched successfully',
      status: 'success',
      data: menus,
    };
  }

  async findMenusWithMeals(businessId: number) {
    await this.isValidRestaurant(businessId);
    const menus = await this.prisma.menu.findMany({
      where: { businessId },
      select: {
        id: true,
        name: true,
        meals: {
          select: {
            meal: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return {
      message: 'Menus fetched successfully',
      status: 'success',
      data: menus.map((menu) => {
        const { meals, ...menuInfo } = menu;
        return {
          ...menuInfo,
          meals: meals.map((meal) => ({ ...meal.meal })),
        };
      }),
    };
  }

  async addMenuMeals(businessId: number, menuId: number, mealIds: number[]) {
    await this.isValidMenu(businessId, menuId);
    const validIds = (
      await Promise.all(
        mealIds.map(async (mealId) => {
          const meal = await this.prisma.meal.findFirst({
            where: { id: mealId, businessId },
          });
          return meal ? mealId : null;
        }),
      )
    ).filter((mealId) => mealId);

    await this.prisma.menuMeals.createMany({
      data: validIds.map((mealId) => ({ mealId, menuId })),
      skipDuplicates: true,
    });

    return {
      message: 'Meals added to menu successfully',
      status: 'success',
    };
  }

  private async isValidMenu(businessId: number, menuId: number) {
    await this.isValidRestaurant(businessId);
    const menu = await this.prisma.menu.findFirst({
      where: { id: menuId, businessId },
    });
    if (!menu) throw new NotFoundException(`Invalid menu`);
  }

  async removeMenuMeals(
    businessId: number,
    menuId: number,
    mealIds: number[],
  ) {
    await this.isValidMenu(businessId, menuId);
    const validIds = (
      await Promise.all(
        mealIds.map(async (mealId) => {
          const meal = await this.prisma.menuMeals.findFirst({
            where: { mealId, menuId },
          });
          return meal ? mealId : null;
        }),
      )
    ).filter((mealId) => mealId);

    await this.prisma.menuMeals.deleteMany({
      where: { mealId: { in: validIds }, menuId },
    });

    return {
      message: 'Meals removed from menu successfully',
      status: 'success',
    };
  }
}
