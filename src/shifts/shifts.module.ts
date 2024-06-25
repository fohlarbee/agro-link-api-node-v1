import { Module } from '@nestjs/common';
import { ShiftsService } from './shifts.service';
import { ShiftsController } from './shifts.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ShiftsController],
  providers: [ShiftsService, PrismaService],
})
export class ShiftsModule {}
