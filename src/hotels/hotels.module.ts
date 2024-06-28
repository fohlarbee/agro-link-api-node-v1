/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [HotelsController],
  providers: [HotelsService, PrismaService],
  exports:[HotelsService]
})
export class HotelsModule {}
