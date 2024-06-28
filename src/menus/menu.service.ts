/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async createMenu({
    name,
    restaurantId,
  }: {
    name: string;
    restaurantId: number;
  }) {
    await this.isValidRestaurant(restaurantId);
    const menu = await this.prisma.menu.create({
      data: { restaurantId, name },
      select: { id: true, name: true },
    });
    return {
      message: 'Menu successfully created',
      status: 'success',
      data: { menu },
    };
  }

  private async isValidRestaurant(restaurantId: number) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });
    if (!restaurant)
      throw new NotFoundException(`No restaurant with id ${restaurantId}`);
  }

  async findAllMenus(restaurantId: number) {
    await this.isValidRestaurant(restaurantId);
    const menus = await this.prisma.menu.findMany({
      where: { restaurantId },
      select: { id: true, name: true },
    });

    return {
      message: 'Menus fetched successfully',
      status: 'success',
      data: menus,
    };
  }

  async findMenusWithMeals(restaurantId: number) {
    await this.isValidRestaurant(restaurantId);
    const menus = await this.prisma.menu.findMany({
      where: { restaurantId },
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

  async addMenuMeals(restaurantId: number, menuId: number, mealIds: number[]) {
    await this.isValidMenu(restaurantId, menuId);
    const validIds = (
      await Promise.all(
        mealIds.map(async (mealId) => {
          const meal = await this.prisma.meal.findFirst({
            where: { id: mealId, restaurantId },
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

  private async isValidMenu(restaurantId: number, menuId: number) {
    await this.isValidRestaurant(restaurantId);
    const menu = await this.prisma.menu.findFirst({
      where: { id: menuId, restaurantId },
    });
    if (!menu) throw new NotFoundException(`Invalid menu`);
  }

  async removeMenuMeals(
    restaurantId: number,
    menuId: number,
    mealIds: number[],
  ) {
    await this.isValidMenu(restaurantId, menuId);
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
