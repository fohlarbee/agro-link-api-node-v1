import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import {
  GuestUserMigrationDTO,
  PurchasedOrderHistoryDTO,
} from "./dto/migration-dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async migrateGuestUser(id: number, migrateDto: GuestUserMigrationDTO) {
    const user = await this.verifyGuestUser(
      migrateDto.guestUsername,
      migrateDto.guestCreatedAt,
    );

    if (!user) {
      throw new NotFoundException("Guest user not found");
    }
    const isUserRegistered = await this.verifyEmail(
      migrateDto.registeredUserEmail,
    );

    if (!isUserRegistered || isUserRegistered.id !== id) {
      throw new BadRequestException(
        "Invalid user, sorry you cannot proceed with migration",
      );
    }

    const result = this.migratePurchasedOrderHistory(
      migrateDto.purchasedOrderHistory,
      id,
    );

    return result;
  }

  async verifyGuestUser(guestUsername: string, guestCreatedAt: Date) {
    const guestUser = await this.prisma.user.findFirst({
      where: { name: guestUsername, createdAt: guestCreatedAt },
    });
    if (!guestUser) {
      throw new NotFoundException("Guest user not found");
    }
    return guestUser;
  }

  async verifyEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async migratePurchasedOrderHistory(
    purchasedOrderHistory: PurchasedOrderHistoryDTO[],
    customerId: number,
  ) {
    for (const order of purchasedOrderHistory) {
      const existingOrder = await this.prisma.order.findUnique({
        where: { id: order.id },
        include: {
          payment: true,
          customer: true,
        },
      });
      if (!existingOrder || existingOrder.payment.reference !== order.reference)
        throw new NotFoundException(
          `No such order with id ${order.id} and payment reference ${order.reference}`,
        );

      if (
        order.amount !== existingOrder.payment.amount ||
        order.paidAt !== existingOrder.paidAt ||
        order.createdAt !== existingOrder.createdAt
      ) {
        throw new BadRequestException(
          `Order with reference ${order.reference} does not match the system requirements`,
        );
      }
      await this.prisma.order.update({
        where: { id: existingOrder.id },
        data: { customerId },
      });

      await this.prisma.payment.update({
        where: { reference: order.reference, id: existingOrder.payment.id },
        data: { userId: customerId },
      });
    }

    return { message: "Migration successful", status: "success" };
  }
}
