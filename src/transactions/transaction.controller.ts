import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { HttpAuthGuard } from "src/auth/guards/http-auth.guard";
import { PaystackAuthInterceptor } from "./interceptors/paystack-auth.interceptor";
import { MonnifyAuthInterceptor } from "./interceptors/monnify-auth.interceptor";

@Controller("transactions")
@ApiTags("Transactions")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Put("/verify/:reference")
  @ApiBearerAuth()
  @UseGuards(HttpAuthGuard)
  async verifyPayment(
    @Param("reference") reference: string,
    @Query("paymentProvider") provider: string,
  ) {
    // const provider = request.headers["provider"];

    if (!provider) throw new BadRequestException("provider is required");

    switch (provider) {
      case "PSK":
        return this.transactionService.handlePaystackTransaction(reference);
      case "MNF":
        return this.transactionService.handleMonnifyTransaction(reference);
      default:
        throw new BadRequestException("Unsupported Provider");
    }
  }

  @Post("/webhook")
  @UseInterceptors(PaystackAuthInterceptor)
  async webhookHandler(@Body() body) {
    const {
      event,
      data: { status, reference },
    } = body;

    if (event != "charge.success")
      return { message: "Unsupported event", status: "error" };
    if (status != "success")
      return { message: "Unsuccessful transaction", status: "error" };
    return this.transactionService.handlePaystackTransaction(reference);
  }

  @Post("/webhook/monnify")
  @UseInterceptors(MonnifyAuthInterceptor)
  async monnifyWebhookHandler(@Body() body) {
    const {
      eventType,
      eventData: { paymentStatus, transactionReference },
    } = body;
    if (eventType != "SUCCESSFUL_TRANSACTION")
      throw new BadRequestException({
        message: "Unsupported event",
        status: "error",
      });
    if (paymentStatus != "PAID")
      throw new BadRequestException({
        message: "Unsuccessful transaction",
        status: "error",
      });
    return this.transactionService.handleMonnifyTransaction(
      transactionReference,
    );
  }
}
