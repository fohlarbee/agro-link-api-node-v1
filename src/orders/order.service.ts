import { BadRequestException, Injectable, NotFoundException,UnprocessableEntityException } from '@nestjs/common';
import { AddMealToOrderDto } from './dto/order-meal.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { PaystackService } from 'src/paystack/paystack.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService, private paystack: PaystackService) {}

  async orderMeal({ tableIdentifier, ...mealOrder }: AddMealToOrderDto, customerId: number, restaurantId: number) {
    const meal = await this.prisma.meal.findUnique({
      where: { id: mealOrder.mealId, AND: { restaurantId } },
      select: { restaurant: true }
    });

    if (!meal) throw new NotFoundException(`No such meal with id ${mealOrder.mealId}`);

    let currentOrder = await this.prisma.order.findFirst({
      where: { customerId, status: OrderStatus.active, restaurantId },
      select: { id: true }
    });

    if (!currentOrder) currentOrder = await this.createNewOrder({
        customerId, restaurantId, tableIdentifier
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

  private async createNewOrder({ customerId, restaurantId, tableIdentifier }: 
    { customerId: number, restaurantId: number, tableIdentifier: string }) {
    const table = await this.prisma
      .table
      .findFirst({
        where: { 
          identifier: tableIdentifier, 
          outlet: { restaurantId: restaurantId }
        },
        select: {
          id: true,
          assignedShifts: {
            where: { shift: { 
              startTime: { lte: new Date() },
              endTime: { gte: new Date() } 
            }},
            select: { shift: true }
          }
        }
      });
    
    if (!table) throw new BadRequestException("Invalid table selected");
    if (table.assignedShifts.length < 1) throw new UnprocessableEntityException("No waiter to take your order at this moment");
    const { id: shiftId, userId: waiterId } = table.assignedShifts[0].shift;
    return this.prisma
      .order
      .create({
        data: { 
          customer: { connect: { id: customerId } }, 
          restaurant: { connect: { id: restaurantId } },
          table: { connect: { id: table.id }},
          shift: { connect: { id: shiftId }},
          waiter: { connect: {
            userId_restaurantId: { userId: waiterId, restaurantId }
          }}
        },
        select: { id: true }
      });
  }

  async findCustomerOrders(customerId: number) {
    const orders = await this.prisma
      .order
      .findMany({
        where: { customerId, status: OrderStatus.active },
        select: { 
          id: true, table: { select: { identifier: true }},
          waiter: { select: { user: { select: { name: true }}} },
          meals: { select: {
            meal: { select: { image: true, name: true, price: true, id: true } }, 
            quantity: true 
          }},
          restaurant: { select: { id: true, name: true }}
        }
      });
    return {
      message: "Orders fetched successfully",
      status: "success", data: orders
    };
  }

  async findOpenRestaurantOrder(customerId: number, restaurantId: number) {
    const currentOrder = await this.prisma
      .order
      .findFirst({
        where: { customerId, status: OrderStatus.active, restaurantId },
        select: { meals: { select: {
          meal: { select: { image: true, name: true, price: true, id: true } }, 
          quantity: true 
        }}}
      });
    return currentOrder.meals || [];
  }

  async findOrder(customerId: number, orderId: number) {
    const order = await this.prisma
      .order
      .findFirst({
        where: { customerId, id: orderId },
        select: { meals: { select: {
          meal: { select: { image: true, name: true, price: true, id: true } }, 
          quantity: true 
        }}}
      });
    return {
      message: "Order fetched successfully",
      status: "success", data: { order }
    };
  }

  async findOrderHistory(customerId: number) {
    return this.prisma.order.findMany({
      where: { customerId, status: { not: OrderStatus.active }},
      select: { status: true, createdAt: true, completedAt: true, id: true, meals: { select: {
        meal: { select: { image: true, name: true, price: true, id: true } }, 
        quantity: true 
      }}},
      orderBy: { createdAt: "desc" }
    })
  }

  async removeMealOrder(id: number, customerId: number, orderId: number) {
    const currentOrderMeal = await this.prisma.orderMeal.findFirst({
      where: { order: { customerId, id: orderId, status: OrderStatus.active }, mealId: id },
      select: { mealId: true, orderId: true }
    });
    if (!currentOrderMeal) throw new BadRequestException("No such meal in order");
    await this.prisma.orderMeal.delete({ where: { orderId_mealId: currentOrderMeal }});
    return { message: "Meal removed from current order", status: "success" };
  }

  async payOrder(email: string, customerId: number, restaurantId: number) {
    const currentOrder = await this.prisma.order.findFirst({
      where: { customerId, restaurantId, status: OrderStatus.active },
      select: { id: true, meals: { select: {
        quantity: true, meal: { select: { price: true }}
      }}}
    });
    if (!currentOrder) throw new BadRequestException("You do not currently have any open orders");
    const totalAmount = currentOrder.meals.reduce ((total, meal) => {
      total += meal.quantity * meal.meal.price
      return total;
    }, 0);
    const paymentLink = await this.paystack.createPaymentLink(email, totalAmount, {
      orderId: currentOrder.id, customerId
    });
    return { 
      message: "Payment initiation successful", status: "success",
      data: { paymentLink: paymentLink.data.authorization_url }
    }
  }

  async fetchPaidOrders(ownerId: number, restaurantId: number) {
    return this.prisma.order.findMany({
      where: { restaurant: { id: restaurantId }, status: OrderStatus.paid },
      select: { 
        id: true, status: true,
        meals: { select: { 
          meal: { select: { image: true, price: true, id: true }},
          quantity: true
        }},
      },
      orderBy: { createdAt: "asc" }
    });
  }
}
