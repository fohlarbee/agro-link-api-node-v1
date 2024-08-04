import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
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
@ApiTags("Wllaet (Customer)")
@ApiBearerAuth()
@UseGuards(HttpAuthGuard)
@ApiHeader({
  name: "access_token",
  required: true,
  description: "This is the customer access token",
})
export class WalletsController {
  constructor(private readonly walletServive: WalletsService) {}

  @Post()
  @ApiOkResponse({ type: BaseResponse })
  async createWallet(@Req() request: Record<string, any>) {
    const { id: customerId } = request.user;
    return await this.walletServive.create(+customerId);
  }

  @Post("add/funds")
  @ApiOkResponse({ type: DepositInitiationResponse })
  async addFunds(
    @Req() request: Record<string, any>,
    @Body() { amount }: FundWalletDto,
  ) {
    const { id: customerId } = request.user;
    return await this.walletServive.addFunds(+customerId, amount);
  }
}
