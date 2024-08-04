import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { HttpAuthGuard } from "src/auth/guards/http-auth.guard";
import { PaystackAuthInterceptor } from "./interceptors/paystack-auth.interceptor";
import { MonnifyAuthInterceptor } from "./interceptors/monnify-auth.interceptor";
import { PaymentType } from "@prisma/client";

@Controller("transactions")
@ApiTags("Transactions")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Put("/verify/:reference")
  @ApiBearerAuth()
  @UseGuards(HttpAuthGuard)
  async verifyPayment(@Param("reference") reference: string, @Req() request) {
    const type = request.headers["type"];
    console.log("type", type);

    if (!type) throw new BadRequestException("Type is required");

    switch (type) {
      case "OTV":
        return this.transactionService.processTransaction(reference);
      case "WTV":
        return this.transactionService.processWalletTransaction(reference);
      default:
        throw new BadRequestException("Invalid type");
    }
  }

  @Post("/webhook")
  @UseInterceptors(PaystackAuthInterceptor)
  async webhookHandler(@Body() body) {
    const {
      event,
      data: { status, reference, metadata },
    } = body;

    if (event != "charge.success")
      return { message: "Unsupported event", status: "error" };
    if (status != "success")
      return { message: "Unsuccessful transaction", status: "error" };

    if (metadata.type === PaymentType.DEPOSIT)
      return this.transactionService.processWalletTransaction(reference);
    return this.transactionService.processTransaction(reference);
  }


  @Post("/webhook/monnify")
  @UseInterceptors(MonnifyAuthInterceptor)
  async monnifyWebhookHandler(@Body() body) {
    const {
      event,
      data: { status, reference },
    } = body;
    if (event != "charge.success")
      return { message: "Unsupported event", status: "error" };
    if (status != "success")
      return { message: "Unsuccessful transaction", status: "error" };
    return this.transactionService.processTransaction(reference);
  }
}
