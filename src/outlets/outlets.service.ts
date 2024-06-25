import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';
import { CreateTableDto } from './dto/create-table.dto';

@Injectable()
export class OutletsService {
  constructor(private prisma: PrismaService) {}

  async createOutlet(restaurantId: number, { address }: CreateOutletDto) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId }
    });
    if (!restaurant) throw new NotFoundException("Invalid restaurant");
    const outlet = await this.prisma.outlet.create({
      data: { restaurantId, address }
    });
    return {
      message: "Outlet created successfully", 
      status: "success", data: { outlet }
    };
  }

  async findOutlets(restaurantId: number) {
    const outlets = await this.prisma.outlet.findMany({
      where: { restaurantId }
    });
    return {
      message: "Outlet fetched successfully", 
      status: "success", data: outlets
    };
  }

  async createTable(restaurantId: number, outletId: number, { identifier }: CreateTableDto) {
    const outlet = await this.prisma
      .outlet
      .findFirst({
        where: { id: outletId, restaurantId }
      });
    
    if (!outlet) throw new BadRequestException("No such outlet in restaurant");
    const table = await this.prisma
      .table
      .create({
        data: { identifier, outletId }
      });
    return {
      message: "Table created successfully",
      status: "success", data: { table }
    };
  }

  async GetOutletTables({ outletId, restaurantId }: { restaurantId: number, outletId: number }) {
    const outlet = await this.prisma
      .outlet
      .findFirst({
        where: { id: outletId, restaurantId }
      });

    if (!outlet) throw new BadRequestException("No such outlet in restaurant");
    const tables = await this.prisma
      .table
      .findMany({
        where: { outletId }
      });
    return {
      message: "Tables fetched successfully",
      status: "success", data: tables
    };
  }
}
