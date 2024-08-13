import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { WalletsService } from "./wallets.service";
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { BaseResponse } from "src/app/entities/BaseResponse.entity";
import { HttpAuthGuard } from "src/auth/guards/http-auth.guard";
import {
  createWalletPinDto,
  FundWalletDto,
  TransferDto,
} from "./dto/wallets-dto";
import {
  DepositInitiationResponse,
  TransactionHistoryResponse,
  WalletBalanceResponse,
} from "./entities/wallets.entity";

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
  constructor(private readonly walletService: WalletsService) {}

  @Post("create")
  @ApiOkResponse({ type: BaseResponse })
  async createWallet(@Req() request: Record<string, any>) {
    const { id: userId } = request.user;
    return await this.walletService.create(+userId);
  }

  @Post("fund")
  @ApiOkResponse({ type: DepositInitiationResponse })
  async addFunds(
    @Query("paymentProvider") provider: string,
    @Req() request: Record<string, any>,
    @Body() { amount }: FundWalletDto,
  ) {
    const { id: userId } = request.user;
    return await this.walletService.addFunds(
      +userId,
      amount,
      provider.toUpperCase(),
    );
  }

  @Get("transactions")
  @ApiOkResponse({ type: TransactionHistoryResponse })
  async getTransactions(@Req() request) {
    const { id: userId } = request.user;
    return this.walletService.transactionHistory(+userId);
  }

  @Get("balance")
  @ApiOkResponse({ type: WalletBalanceResponse })
  @ApiOkResponse({ example: { balance: 0.0 } })
  async getBalance(@Req() request) {
    const { id: userId } = request.user;
    return this.walletService.getBalance(+userId);
  }
  @Put("transfer")
  @ApiOkResponse({ type: BaseResponse })
  async transfer(
    @Req() request: Record<string, any>,
    @Body() { amount, fromWalletId, toWalletId, pin }: TransferDto,
  ) {
    const { id: userId } = request.user;
    return await this.walletService.transfer(
      amount,
      fromWalletId,
      toWalletId,
      userId,
      pin,
    );
  }

  @Put("pin")
  @ApiOkResponse({ type: BaseResponse })
  async createPin(
    @Req() request: Record<string, any>,
    @Body() { pin }: createWalletPinDto,
  ) {
    const { wallet_id: walletId } = request.headers;
    return await this.walletService.createPin(+walletId, pin);
  }
}
