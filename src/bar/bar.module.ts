/* -disable prettier/prettier */
import { Module } from '@nestjs/common';
import { BarService } from './bar.service';
import { BarController } from './bar.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  providers: [BarService, PrismaService],
  controllers: [BarController],
  exports: [BarService],
})
export class BarModule {}
