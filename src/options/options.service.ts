import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateOptionDto } from "./dto/create-option.dto";
import { UpdateOptionDto } from "./dto/update-option.dto";
import * as fs from "fs";

@Injectable()
export class OptionService {
  constructor(private prisma: PrismaService) {}

  async createMeal(mealData: CreateOptionDto, businessId: number) {
    // if (!fs.existsSync(`./uploads/images/${mealData.image}`)) throw new BadRequestException(`Unknown image file ${mealData.image}`);
    const business = await this.prisma.business.findUnique({
      where: { id: businessId }
    });
    if (!business) throw new NotFoundException("Invalid business");
    await this.prisma.option.create({
      data: { ...mealData, businessId }
    });
    return { message: "Meal successfully created", status: "success" };
  }

  async findAll(businessId: number) {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId }
    });
    if (!business)
      throw new NotFoundException(`No business with id ${businessId}`);
    const meals = await this.prisma.option.findMany({
      where: { businessId },
      select: { name: true, id: true, price: true, image: true }
    });
    return meals;
  }

  async update(
    id: number,
    updateMealData: UpdateOptionDto,
    businessId: number
  ) {
    if (
      updateMealData.image &&
      !fs.existsSync(`./uploads/images/${updateMealData.image}`)
    )
      throw new BadRequestException(
        `Unknown image file ${updateMealData.image}`
      );
    const business = await this.prisma.business.findUnique({
      where: { id: businessId }
    });
    if (!business) throw new NotFoundException("Invalid business");
    const option = await this.prisma.option.findUnique({
      where: { id, businessId: business.id }
    });
    if (!option) throw new NotFoundException("No such option in business menu");
    await this.prisma.option.update({
      where: { id },
      data: updateMealData
    });
    if (updateMealData.image && option.image != updateMealData.image)
      await this.deleteImageFile(option.image);
    return { message: "Meal update successful", status: "success" };
  }

  async remove(id: number, businessId: number) {
    const option = await this.prisma.option.findUnique({
      where: { id, businessId }
    });
    if (!option) throw new NotFoundException("Restaurant has no such option");
    await this.prisma.option.delete({ where: { id } });
    await this.deleteImageFile(option.image);
    return { message: "Meal delete successful", status: "success" };
  }

  private async deleteImageFile(filename: string) {
    const imageUseCount = await this.prisma.option.count({
      where: { image: filename }
    });
    if (imageUseCount < 1)
      fs.rmSync(`./uploads/images/${filename}`, { force: true });
  }
}
