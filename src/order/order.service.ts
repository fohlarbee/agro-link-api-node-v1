import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AddMealToOrderDto } from './dto/order-meal.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async orderMeal(mealOrder: AddMealToOrderDto, customerId: number, restaurantId: number) {
    const meal = await this.prisma.meal.findUnique({
      where: { id: mealOrder.mealId, AND: { menu: { restaurantId }} },
      select: { menu: { select: { restaurant: true }}}
    });
    if (!meal) throw new NotFoundException(`No such meal with id ${mealOrder.mealId}`);
    let currentOrder = await this.prisma.order.findFirst({
      where: { customerId, status: OrderStatus.active, restaurantId },
      select: { id: true }
    });
    if (!currentOrder) currentOrder = await this.prisma.order.create({
      data: { customerId, restaurantId },
      select: { id: true }
    });

    await this.prisma.orderMeal.upsert({
      where: { orderId_mealId: { orderId: currentOrder.id, mealId: mealOrder.mealId }},
      create: { ...mealOrder, orderId: currentOrder.id },
      update: { quantity: mealOrder.quantity }
    });
    return {
      message: "Meal added to order successfully",
      status: "success"
    };
  }

  async findCurrentOrder(customerId: number, restaurantId: number) {
    const currentOrder = await this.prisma.order.findFirst({
      where: { customerId, status: OrderStatus.active, restaurantId },
      select: { meals: { select: {
        meal: { select: { image: true, name: true, price: true, id: true } }, 
        quantity: true 
      }}}
    });
    return currentOrder.meals || [];
  }

  async findOrderHistory(customerId: number, restaurantId: number) {
    return this.prisma.order.findMany({
      where: { customerId, status: { not: OrderStatus.active }, restaurantId },
      select: { status: true, createdAt: true, completedAt: true, id: true, meals: { select: {
        meal: { select: { image: true, name: true, price: true, id: true } }, 
        quantity: true 
      }}},
      orderBy: { createdAt: "desc" }
    })
  }

  async removeMealOrder(id: number, customerId: number, restaurantId: number) {
    const currentOrderMeal = await this.prisma.orderMeal.findFirst({
      where: { order: { customerId, restaurantId, status: OrderStatus.active }, mealId: id },
      select: { mealId: true, orderId: true }
    });
    if (!currentOrderMeal) throw new BadRequestException("No such meal in order");
    await this.prisma.orderMeal.delete({ where: { orderId_mealId: currentOrderMeal }});
    return { message: "Meal removed from current order", status: "success" };
  }
}
