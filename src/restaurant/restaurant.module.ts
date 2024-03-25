import { Module } from '@nestjs/common';
import { RestaurantService as RestaurantService } from './restaurant.service';
import { RestaurantController as RestaurantController } from './restaurant.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [RestaurantController],
  providers: [PrismaService, RestaurantService],
})
export class RestaurantModule {}
