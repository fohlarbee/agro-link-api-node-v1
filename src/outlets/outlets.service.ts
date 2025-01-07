import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateOutletDto } from "./dto/create-outlet.dto";
import { CreateTableDto } from "./dto/create-table.dto";

@Injectable()
export class OutletsService {
  constructor(private prisma: PrismaService) {}

  async createOutlet(businessId: number, { address }: CreateOutletDto) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business) throw new NotFoundException("Invalid business");
    const outlet = await this.prisma.outlet.create({
      data: { businessId, address, type: "branch" },
    });
    return {
      message: "Outlet created successfully",
      status: "success",
      data: { outlet },
    };
  }

  async findOutlets(businessId: number) {
    const outlets = await this.prisma.outlet.findMany({
      where: { businessId },
    });
    return {
      message: "Outlet fetched successfully",
      status: "success",
      data: outlets,
    };
  }
}
