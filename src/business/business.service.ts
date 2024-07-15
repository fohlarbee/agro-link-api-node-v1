import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UpdateBusinessDto } from "./dto/updateBusinessDto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  // Client methods
  async findAllBusinesses() {
    const businesses = await this.prisma.business.findMany({
      select: {
        name: true,
        id: true,
        phoneNumber: true,
      },
    });

    return {
      message: "businesses fetched successfully",
      status: "success",
      data: businesses,
    };
  }

  async findBusiness(id: number) {
    const business = await this.prisma.business.findUnique({
      where: { id },
    });

    if (!business)
      throw new NotFoundException({
        message: `No such business with id ${id}`,
        status: "error",
      });

    return {
      message: "Business fetch successful",
      status: "success",
      data: { business },
    };
  }

  // Admin methods

  async createBusiness(createData: CreateBusinessDto, creatorId: number) {
    const business = await this.prisma.business.create({
      data: { ...createData, creatorId },
    });

    await this.prisma.staff.create({
      data: {
        business: { connect: { id: business.id } },
        user: { connect: { id: creatorId } },
        role: {
          create: {
            name: "owner",
            businessId: business.id as unknown as number,
          },
        },
      },
    });

    return {
      message: "Business created successfully.",
      status: "success",
      data: { business },
    };
  }

  async findStaffBusiness(userId: number) {
    const businesses = await this.prisma.staff.findMany({
      where: { userId },
      select: {
        business: {
          select: {
            name: true,
            id: true,
          },
        },
        role: { select: { name: true } },
      },
    });

    return {
      message: "Businesses fetched successfully",
      status: "success",
      data: businesses,
    };
  }

  async updateBusiness(
    id: number,
    userId: number,
    updateData: UpdateBusinessDto,
  ) {
    let business = await this.prisma.business.findUnique({
      where: {
        id,
        staffs: { some: { userId, role: { name: "owner " } } },
      },
    });
    if (!business)
      throw new ForbiddenException({
        message: `Unauthorised edit of business`,
        status: "error",
      });
    business = await this.prisma.business.update({
      where: { id },
      data: { ...updateData },
    });

    return {
      message: "Business update successful",
      status: "success",
      data: { business },
    };
  }

  async findBusinessWithRelations(
    id: number,
    page: number,
    perPage: number,
    sortBy: string,
    // filter?: {
    //   name?: string;
    //   type?: BusinessType;
    // },
  ) {
    const skip = (page - 1) * perPage;
    let startDate: Date;
    let endDate: Date;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisYear = new Date(today.getFullYear(), 0, 1);

    switch (sortBy) {
      case "today":
        startDate = today;
        endDate = new Date(today.getTime() + 24 * 60 * 60 * 1000); // Next day
        break;
      case "yesterday":
        startDate = yesterday;
        endDate = today;
        break;
      case "thisWeek":
        startDate = thisWeek;
        endDate = today;
        break;
      case "thisMonth":
        startDate = thisMonth;
        endDate = today;
        break;
      case "thisYear":
        startDate = thisYear;
        endDate = today;
        break;
      default:
        startDate = new Date(0); // All time
        endDate = today;
        break;
    }

    const business = await this.prisma.business.findUnique({
      where: { id },
    });
    if (!business)
      throw new ForbiddenException({
        message: ` business not Found`,
        status: "error",
      });

    const result = await this.prisma.business.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          },
        },
        menus: {
          where: {
            createdAt: { gte: startDate, lt: endDate },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: perPage,
        },
        staffs: {
          where: {
            createdAt: { gte: startDate, lt: endDate },
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
              },
            },
            role: true,
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: perPage,
        },
        orders: {
          where: { createdAt: { gte: startDate, lt: endDate } },
          include: {
            waiter: true,
            payment: true,
            table: true,
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: perPage,
        },
        options: {
          where: { createdAt: { gte: startDate, lt: endDate } },
          orderBy: { createdAt: "desc" },
          skip,
          take: perPage,
        },
        outlets: {
          include: {
            tables: true,
          },
          skip,
          take: perPage,
        },
      },
    });

    const pagination = {
      menus: {
        page,
        perPage,
        totalPages: Math.ceil(
          (await this.prisma.menu.count({ where: { businessId: id } })) /
            perPage,
        ),
      },
      staffs: {
        page,
        perPage,
        totalPages: Math.ceil(
          (await this.prisma.staff.count({ where: { businessId: id } })) /
            perPage,
        ),
      },
      orders: {
        page,
        perPage,
        totalPages: Math.ceil(
          (await this.prisma.order.count({ where: { businessId: id } })) /
            perPage,
        ),
      },
      options: {
        page,
        perPage,
        totalPages: Math.ceil(
          (await this.prisma.option.count({ where: { businessId: id } })) /
            perPage,
        ),
      },
      outlets: {
        page,
        perPage,
        totalPages: Math.ceil(
          (await this.prisma.outlet.count({ where: { businessId: id } })) /
            perPage,
        ),
      },
    };

    return {
      message: "Analytic Data fetched successfully",
      status: "success",
      data: result,
      pagination,
    };
  }
}
