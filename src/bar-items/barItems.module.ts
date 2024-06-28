import { Module } from '@nestjs/common';
import { BarItemsController } from './barItems.controller';
import { BarItemsService } from './barItems.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BarItemsController],
  providers: [BarItemsService, PrismaService],
  exports: [BarItemsService]
})
export class BarItemsModule {}
