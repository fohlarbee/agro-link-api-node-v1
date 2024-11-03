import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async createRole(
    businessId: number,
    creatorId: number,
    { name }: CreateRoleDto,
  ) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId, creatorId },
    });
    if (!business) throw new NotFoundException("Invalid business");
    const existingRole = await this.prisma.role.findFirst({
      where: { businessId, name },
    });
    if (existingRole)
      throw new ConflictException("Role with name already exists");
    const role = await this.prisma.role.create({
      data: { name, businessId },
      select: { id: true, name: true },
    });

    return {
      message: "Role created successfully",
      status: "success",
      data: { role },
    };
  }

  async findAllRoles(businessId: number, creatorId: number) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId, creatorId },
    });
    if (!business) throw new NotFoundException("Invalid business");

    const roles = await this.prisma.role.findMany({
      where: { businessId },
      select: { id: true, name: true },
    });
    return {
      message: "Roles fetched successfully",
      status: "success",
      data: roles,
    };
  }
}
