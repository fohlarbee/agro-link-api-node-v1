import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

export enum MenuTypes {
  starters = "starters",
  breakfast = "breakfast",
  lunch = "lunch",
  dinner = "dinner",
  mains = "mains",
}
@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async createMenu(name: string, businessId: number, menuType: any) {
    await this.isValidBusiness(businessId);
    const menu = await this.prisma.menu.create({
      data: {
        businessId,
        name,
        type: menuType,
      },
      select: { id: true, name: true },
    });
    return {
      message: "Menu successfully created",
      status: "success",
      data: { menu },
    };
  }

  private async isValidBusiness(businessId: number) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business)
      throw new NotFoundException(`No business with id ${businessId}`);
  }

  async findAllMenus(businessId: number) {
    await this.isValidBusiness(businessId);
    const menus = await this.prisma.menu.findMany({
      where: { businessId },
      select: {
        id: true,
        name: true,
        business: {
          select: {
            id: true,
            name: true,
            outlets: true,
          },
        },
      },
    });

    return {
      message: "Menus fetched successfully",
      status: "success",
      data: menus,
    };
  }

  async findMenusWithOptions(businessId: number) {
    await this.isValidBusiness(businessId);
    const menus = await this.prisma.menu.findMany({
      where: { businessId },
      select: {
        id: true,
        name: true,
        type: true,
        businessId: true,
        options: {
          select: {
            option: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
              },
            },
          },
        },
        business: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const business = menus[0].business;
    const menuData = menus.reduce(
      (acc, menu) => {
        const typeName = menu.type.toLowerCase();
        acc.menu[typeName] = acc.menu[typeName] || [];
        acc.menu[typeName].push(...menu.options.map((option) => option.option));
        return acc;
      },
      { menu: {} },
    );

    return {
      id: menus[0].id,
      business_id: business.id,
      business_name: business.name,
      ...menuData,
    };
  }

  async addMenuOptions(
    businessId: number,
    menuId: number,
    optionIds: number[],
  ) {
    await this.isValidMenu(businessId, menuId);
    const validIds = (
      await Promise.all(
        optionIds.map(async (optionId) => {
          const option = await this.prisma.option.findFirst({
            where: { id: optionId, businessId },
          });
          return option ? optionId : null;
        }),
      )
    ).filter((optionId) => optionId);

    await this.prisma.menuOptions.createMany({
      data: validIds.map((optionId) => ({ optionId, menuId })),
      skipDuplicates: true,
    });

    return {
      message: "Options added to menu successfully",
      status: "success",
    };
  }

  private async isValidMenu(businessId: number, menuId: number) {
    await this.isValidBusiness(businessId);
    const menu = await this.prisma.menu.findFirst({
      where: { id: menuId, businessId },
    });
    if (!menu) throw new NotFoundException(`Invalid menu`);
  }

  async removeMenuOptions(
    businessId: number,
    menuId: number,
    optionIds: number[],
  ) {
    await this.isValidMenu(businessId, menuId);
    const validIds = (
      await Promise.all(
        optionIds.map(async (optionId) => {
          const option = await this.prisma.menuOptions.findFirst({
            where: { optionId, menuId },
          });
          return option ? optionId : null;
        }),
      )
    ).filter((optionId) => optionId);

    await this.prisma.menuOptions.deleteMany({
      where: { optionId: { in: validIds }, menuId },
    });

    return {
      message: "Options removed from menu successfully",
      status: "success",
    };
  }
}
