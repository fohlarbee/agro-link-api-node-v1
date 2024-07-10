import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/updateBusinessDto';
import { PrismaService } from 'src/prisma/prisma.service';

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
      message: 'businesses fetched successfully',
      status: 'success',
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
        status: 'error',
      });

    return {
      message: 'Business fetch successful',
      status: 'success',
      data: { business },
    };
  }

  // Admin methods

  async createBusiness(createData: CreateBusinessDto, creatorId: number) {
    const business = await this.prisma.business.create({
      data: { ...createData, creatorId},
    });

    await this.prisma.staff.create({
      data: {
        business: { connect: { id:  business.id } },
        user: { connect: { id: creatorId } },
        role: {
          create: {
            name: 'owner',
            businessId: business.id as unknown as number,
          },
        },
      },
    });

    return {
      message: 'Business created successfully.',
      status: 'success',
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
      message: 'Businesses fetched successfully',
      status: 'success',
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
        staffs: { some: { userId, role: { name: 'owner ' } } },
      },
    });
    if (!business)
      throw new ForbiddenException({
        message: `Unauthorised edit of business`,
        status: 'error',
      });
    business = await this.prisma.business.update({
      where: { id },
      data: {...updateData}
    });

    return {
      message: 'Business update successful',
      status: 'success',
      data: { business },
    };
  }
}
