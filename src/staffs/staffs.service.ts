/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateStaffDto } from './dto/create-staff.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StaffsService {
  constructor(private prisma: PrismaService) {}

  async createStaff(
    restaurantId: number,
    { email, name, roleId }: CreateStaffDto,
  ) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Invalid restaurant');
    const role = await this.prisma.role.findFirst({
      where: { id: roleId, restaurantId },
    });
    if (!role) throw new BadRequestException('No such role exists');
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user)
      return this.inviteExistingUser({ restaurantId, userId: user.id, roleId });
    return this.inviteNewUser({ restaurantId, email, name, roleId });
  }

  private async inviteExistingUser({
    restaurantId,
    userId,
    roleId,
  }: {
    restaurantId: number;
    userId: number;
    roleId: number;
  }) {
    const staff = await this.prisma.staff.findFirst({
      where: { userId, restaurantId },
    });
    if (staff) throw new BadRequestException('Staff already exists');
    await this.prisma.staff.create({
      data: {
        role: { connect: { id: roleId } },
        user: { connect: { id: userId } },
        restaurant: { connect: { id: restaurantId } },
      },
    });
    return {
      message: 'User invited successfully',
      status: 'success',
    };
  }

  private async inviteNewUser({
    restaurantId,
    email,
    name,
    roleId,
  }: {
    restaurantId: number;
    email: string;
    name: string;
    roleId: number;
  }) {
    const hashedPassword = bcrypt.hashSync(
      process.env.NEW_ADMIN_PASSWORD,
      bcrypt.genSaltSync(),
    );
    const user = await this.prisma.user.create({
      data: { email, name, password: hashedPassword },
    });
    await this.prisma.staff.create({
      data: {
        role: { connect: { id: roleId } },
        user: { connect: { id: user.id } },
        restaurant: { connect: { id: restaurantId } },
      },
    });
    return {
      message: 'User invited successfully',
      status: 'success',
    };
  }

  async findAllStaffs(restaurantId: number) {
    const staffs = await this.prisma.staff.findMany({
      where: { restaurantId },
      select: {
        user: { select: { name: true, id: true, email: true } },
        role: { select: { name: true, id: true } },
      },
    });
    return {
      message: 'Staffs fetched successfully',
      status: 'success',
      data: staffs,
    };
  }

  async findStaff(userId: number, restaurantId: number) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Invalid restaurant');
    const staff = await this.prisma.staff.findFirst({
      where: { restaurantId, userId },
      select: {
        user: { select: { name: true, id: true, email: true } },
        role: { select: { name: true, id: true } },
      },
    });
    if (!staff) throw new NotFoundException('No such staff');
    return {
      message: 'Staff fetched successfully',
      status: 'success',
      data: { staff },
    };
  }
}
