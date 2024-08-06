import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { WalletsService } from "./wallets.service";
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { BaseResponse } from "src/app/entities/BaseResponse.entity";
import { HttpAuthGuard } from "src/auth/guards/http-auth.guard";
import { FundWalletDto } from "./dto/wallets-dto";
import { DepositInitiationResponse } from "./entities/wallets.entity";

@Controller("wallets")
@ApiTags("Wallet (Customer)")
@ApiBearerAuth()
@UseGuards(HttpAuthGuard)
@ApiHeader({
  name: "access_token",
  required: true,
  description: "This is the customer access token",
})
export class WalletsController {
  constructor(private readonly walletServive: WalletsService) {}

  @Post("create")
  @ApiOkResponse({ type: BaseResponse })
  async createWallet(@Req() request: Record<string, any>) {
    const { id: userId } = request.user;
    return await this.walletServive.create(+userId);
  }

  @Post("fund")
  @ApiOkResponse({ type: DepositInitiationResponse })
  async addFunds(
    @Req() request: Record<string, any>,
    @Body() { amount }: FundWalletDto,
  ) {
    const { wallet_id} = request.headers;
    return await this.walletServive.addFunds(+wallet_id, amount);
  }

  @Get("transactions")
  async getTransactions(@Req() request: Record<string, any>) {
    const { wallet_id} = request.headers;
    // const {id: userId} = request.user;
    return this.walletServive.transactionHistory(+wallet_id);
  }
  @Post("pay")
  @ApiOkResponse({ type: BaseResponse })
  async payOrder(
    @Req() request: Record<string, any>,
    @Body() body: Record<string, any>,
  ) {
    const { id: customerId } = request.user;
    const { walletId, orderId } = body;
    const { business_id } = request.headers;
    return this.walletServive.payOrder(
      +customerId,
      +walletId,
      +orderId,
      +business_id,
    );
  }

  @Get("balance")
  @ApiOkResponse({ example: { balance: 0.0 } })
  async getBalance(@Req() request: Record<string, any>) {
    const { wallet_id } = request.headers;
    return this.walletServive.getBalance(+wallet_id);
  }
}
