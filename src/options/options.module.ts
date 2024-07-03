import { Module } from '@nestjs/common';
import { OptionService } from './options.service';
import { AdminMealsController, OptionController } from './options.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AdminMealsController, OptionController],
  providers: [OptionService, PrismaService],
})
export class OptionsModule {}
