import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateShiftDto, UpdatePeriodDto } from "./dto/create-shift.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class ShiftsService {
  constructor(private prisma: PrismaService) {}

  async createShift(businessId: number, shiftData: CreateShiftDto) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) throw new NotFoundException("No such business.");
    const shiftRole = await this.prisma.role.findFirst({
      where: { id: shiftData.roleId, businessId },
    });
    const outlet = await this.prisma.outlet.findFirst({
      where: { id: shiftData.outletId, businessId },
    });
    if (!outlet) throw new BadRequestException("No such outlet in business");
    if (!shiftRole) throw new BadRequestException("Invalid role selected");
    const assignee = await this.prisma.staff.findFirst({
      where: { userId: shiftData.userId, roleId: shiftRole.id, businessId },
    });
    if (!assignee)
      throw new BadRequestException(`No such staff for ${shiftRole.name} role`);
    const shift = await this.prisma.shift.create({
      data: {
        role: { connect: { id: shiftRole.id } },
        user: { connect: { id: assignee.userId } },
        business: { connect: { id: business.id } },
        outlet: { connect: { id: shiftData.outletId } },
        staff: {
          connect: {
            userId_businessId: {
              userId: assignee.userId,
              businessId,
            },
          },
        },
        startTime: shiftData.startTime,
        endTime: shiftData.endTime,
        // periods: { createMany: { data: shiftData.periods } },
      },
    });

    shiftData.periods.forEach(async (period) => {
      await this.prisma.period.create({
        data: {
          day: period.day,
          startTime: period.startTime,
          endTime: period.endTime,
          shiftId: shift.id,
        },
      });
    });

    return {
      message: "Shift created successfully",
      status: "success",
      data: { shift },
    };
  }

  async findAllShifts(businessId: number) {
    const shifts = await this.prisma.shift.findMany({
      where: { businessId },
      include: {
        assignedTables: {
          include: {
            table: true,
          },
        },
        outlet: true,
        user: true,
        role: true,
      },
    });
    return {
      message: "Shifts fetched successfully",
      status: "success",
      data: shifts,
    };
  }

  async assignShiftTables(
    businessId: number,
    shiftId: number,
    tableIds: number[],
  ) {
    const shift = await this.prisma.shift.findFirst({
      where: { id: shiftId, businessId },
    });
    const tables = await Promise.all(
      tableIds.map(async (tableId) => {
        const table = await this.prisma.table.findFirst({
          where: { id: tableId, outletId: shift.outletId },
        });
        return { tableId, table };
      }),
    );
    const invalidTableIds = tables
      .filter((table) => !table.table)
      .map((table) => table.tableId);
    if (invalidTableIds.length > 0)
      throw new BadRequestException(
        `These tables do not exist in shift outlet ${invalidTableIds}`,
      );
    await this.prisma.shiftTables.createMany({
      data: tableIds.map((tableId) => ({ shiftId, tableId })),
    });

    return {
      message: "Tables assigned successfully",
      status: "success",
    };
  }

  async updatePeriod(periodId: number, updateDto: UpdatePeriodDto) {
    if (!periodId) throw new BadRequestException("Period ID is required");

    const period = await this.prisma.period.findUnique({
      where: { id: periodId },
    });

    if (!period) throw new NotFoundException("No such period");

    await this.prisma.period.update({
      where: { id: periodId },
      data: updateDto,
    });

    return {
      message: "Period updated successfully",
      status: "success",
    };
  }
}
