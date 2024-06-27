import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async createRole(restaurantId: number, { name }: CreateRoleDto) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });
    if (!restaurant) throw new NotFoundException('Invalid restaurant');
    const existingRole = await this.prisma.role.findFirst({
      where: { restaurantId, name: name.toLowerCase() },
    });

    if (existingRole)
      throw new ConflictException('Role with name already exists');
    const role = await this.prisma.role.create({
      data: { name: name.toLowerCase(), restaurantId },
      select: { id: true, name: true },
    });

    return {
      message: 'Role created successfully',
      status: 'success',
      data: { role },
    };
  }

  findAllRoles(restaurantId: number) {
    const roles = this.prisma.role.findMany({
      where: { restaurantId },
      select: { id: true, name: true },
    });
    return {
      message: 'Roles fetched successfully',
      status: 'success',
      data: roles,
    };
  }
}
