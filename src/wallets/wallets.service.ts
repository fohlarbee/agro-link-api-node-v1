import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PaystackService } from "src/paystack/paystack.service";
import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "src/users/users.service";
import { DepositInitiationResponse } from "./entities/wallets.entity";

@Injectable()
export class WalletsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private paystack: PaystackService,
  ) {}

  async create(customerId: number): Promise<any> {
    const user = await this.usersService.profile(customerId);
    if (!user) throw new UnauthorizedException("User not found");

    const existingWallet = await this.prisma.wallet.findFirst({
      where: { ownerId: user.data.id },
    });
    if (existingWallet)
      throw new ConflictException("User already has a wallet");

    await this.prisma.wallet.create({
      data: {
        ownerId: user.data.id,
        balance: 0.0,
      },
    });

    return {
      message: "Wallet created successfully",
      status: "success",
    };
  }

  async addFunds(customerId: number, amount: number): Promise<any> {
    const user = await this.usersService.profile(customerId);
    if (!user) throw new UnauthorizedException("User not found");

    const wallet = await this.prisma.wallet.findFirst({
      where: { ownerId: customerId },
      select: { id: true, balance: true },
    });
    if (!wallet)
      throw new UnauthorizedException("No wallet for user " + customerId);

    const payload = {
      email: user.data.email,
      amount,
      metadata: { customerId, walletId: wallet.id },
    };

    const { paymentLink, reference } =
      await this.paystack.createPaymentLink(payload);

    return {
      message: "Deeosit initiation successful",
      status: "success",
      data: {
        paymentLink,
        reference,
      },
    } as DepositInitiationResponse;
  }
}
