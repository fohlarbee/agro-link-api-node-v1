import { Module } from '@nestjs/common';
import { MealsService } from './meals.service';
import { AdminMealsController, MealsController } from './meals.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AdminMealsController, MealsController],
  providers: [MealsService, PrismaService],
})
export class MealsModule {}
