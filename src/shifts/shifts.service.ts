import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ShiftsService {
  constructor(private prisma: PrismaService) {}

  async createShift(restaurantId: number, shiftData: CreateShiftDto) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });
    if (!restaurant) throw new NotFoundException("No such restaurant.");
    const shiftRole = await this.prisma.role.findFirst({
      where: { id: shiftData.roleId, restaurantId }
    });
    const outlet = await this.prisma.outlet.findFirst({
      where: { id: shiftData.outletId, restaurantId }
    });
    if (!outlet) throw new BadRequestException("No such outlet in restaurant");
    if (!shiftRole) throw new BadRequestException("Invalid role selected");
    const assignee = await this.prisma.staff.findFirst({
      where: { userId: shiftData.userId, roleId: shiftRole.id, restaurantId }
    });
    if (!assignee) throw new BadRequestException(`No such staff for ${shiftRole.name} role`);
    const shift = await this.prisma.shift.create({
      data: {
        role: { connect: { id: shiftRole.id }},
        user: { connect: { id: assignee.userId }},
        restaurant: { connect: { id: restaurant.id }},
        outlet: { connect: { id: shiftData.outletId }},
        staff: { connect: { userId_restaurantId: { 
          userId: assignee.userId,
          restaurantId
        }}},
        startTime: shiftData.startTime,
        endTime: shiftData.endTime
      }
    });
    return {
      message: "Shift created successfully",
      status: "success", data: { shift }
    };
  }

  async findAllShifts(restaurantId: number) {
    const shifts = await this.prisma.shift.findMany({
      where: { restaurantId },
      include: {
        assignedTables: {
          include: {
            table: true
          }
        },
        outlet: true,
        user: true,
        role: true
      }
    })
    return {
      message: "Shifts fetched successfully",
      status: "success", data: shifts
    };
  }

  async assignShiftTables(restaurantId: number, shiftId: number, tableIds: number[]) {
    const shift = await this.prisma.shift.findFirst({
      where: { id: shiftId, restaurantId }
    });
    const tables = await Promise.all(tableIds.map(async tableId => {
      const table = await this.prisma.table.findFirst({
        where: { id: tableId, outletId: shift.outletId }
      });
      return { tableId, table }
    }));
    const invalidTableIds = tables.filter(table => !table.table).map(table => table.tableId);
    if (invalidTableIds.length > 0) throw new BadRequestException(`These tables do not exist in shift outlet ${invalidTableIds}`);
    await this.prisma.shiftTables.createMany({
      data: tableIds.map(tableId => ({ shiftId, tableId }))
    });
    return {
      message: "Tables assigned successfully",
      status: "success"
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} shift`;
  }

  update(id: number, updateShiftDto: UpdateShiftDto) {
    return `This action updates a #${id} shift`;
  }

  remove(id: number) {
    return `This action removes a #${id} shift`;
  }
}
