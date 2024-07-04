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
    businessId: number,
    { email, name, roleId }: CreateStaffDto,
  ) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business) throw new NotFoundException('Invalid business');
    const role = await this.prisma.role.findFirst({
      where: { id: roleId, businessId },
    });
    if (!role) throw new BadRequestException('No such role exists');
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user)
      return this.inviteExistingUser({ businessId, userId: user.id, roleId });
    return this.inviteNewUser({ businessId, email, name, roleId });
  }

  private async inviteExistingUser({
    businessId,
    userId,
    roleId,
  }: {
    businessId: number;
    userId: number;
    roleId: number;
  }) {
    const staff = await this.prisma.staff.findFirst({
      where: { userId,businessId },
    });
    if (staff) throw new BadRequestException('Staff already exists');
    await this.prisma.staff.create({
      data: {
        role: { connect: { id: roleId } },
        user: { connect: { id: userId } },
        business: { connect: { id: businessId } },
      },
    });
    return {
      message: 'User invited successfully',
      status: 'success',
    };
  }

  private async inviteNewUser({
    businessId,
    email,
    name,
    roleId,
  }: {
    businessId: number;
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
        business: { connect: { id: businessId } },
      },
    });
    return {
      message: 'User invited successfully',
      status: 'success',
    };
  }

  async findAllStaffs(businessId: number) {
    const staffs = await this.prisma.staff.findMany({
      where: { businessId },
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

  async findStaff(userId: number, businessId: number) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business) throw new NotFoundException('Invalid business');
    const staff = await this.prisma.staff.findFirst({
      where: { businessId, userId },
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
