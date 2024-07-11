import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateOptionDto } from "./dto/create-option.dto";
import { UpdateOptionDto } from "./dto/update-option.dto";
import * as fs from "fs";

@Injectable()
export class OptionsService {
  constructor(private prisma: PrismaService) {}

  async createOption(optionData: CreateOptionDto, businessId: number) {
    // if (!fs.existsSync(`./uploads/images/${optionData.image}`)) throw new BadRequestException(`Unknown image file ${optionData.image}`);
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business) throw new NotFoundException("Invalid business");
    await this.prisma.option.create({
      data: { ...optionData, businessId },
    });
    return { message: "Option successfully created", status: "success" };
  }

  async findAll(businessId: number) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business)
      throw new NotFoundException(`No business with id ${businessId}`);
    const options = await this.prisma.option.findMany({
      where: { businessId },
      select: { name: true, id: true, price: true, image: true },
    });
    return options;
  }

  async update(
    id: number,
    updateoptionData: UpdateOptionDto,
    businessId: number,
  ) {
    if (
      updateoptionData.image &&
      !fs.existsSync(`./uploads/images/${updateoptionData.image}`)
    )
      throw new BadRequestException(
        `Unknown image file ${updateoptionData.image}`,
      );
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
    });
    if (!business) throw new NotFoundException("Invalid business");
    const option = await this.prisma.option.findUnique({
      where: { id, businessId: business.id },
    });
    if (!option) throw new NotFoundException("No such option in business menu");
    await this.prisma.option.update({
      where: { id },
      data: updateoptionData,
    });
    if (updateoptionData.image && option.image != updateoptionData.image)
      await this.deleteImageFile(option.image);
    return { message: "Option update successful", status: "success" };
  }

  async remove(id: number, businessId: number) {
    const option = await this.prisma.option.findUnique({
      where: { id, businessId },
    });
    if (!option) throw new NotFoundException("Restaurant has no such option");
    await this.prisma.option.delete({ where: { id } });
    await this.deleteImageFile(option.image);
    return { message: "Option delete successful", status: "success" };
  }

  private async deleteImageFile(filename: string) {
    const imageUseCount = await this.prisma.option.count({
      where: { image: filename },
    });
    if (imageUseCount < 1)
      fs.rmSync(`./uploads/images/${filename}`, { force: true });
  }
}
