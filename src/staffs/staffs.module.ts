import { Module } from '@nestjs/common';
import { StaffsService } from './staffs.service';
import { StaffsController } from './staffs.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [StaffsController],
  providers: [PrismaService, StaffsService],
})
export class StaffsModule {}
