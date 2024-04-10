import { Body, Controller, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { PaystackAuthInterceptor } from './interceptors/headers.interceptor';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post("/verify/:reference")
  @ApiBearerAuth()
  @Roles("customer")
  @UseGuards(JwtAuthGuard, RoleGuard)
  async verifyPayment(@Param("reference") reference: string) {
    return this.transactionService.processTransaction(reference);
  }

  @Post("/webhook")
  @UseInterceptors(PaystackAuthInterceptor)
  async webhookHandler(@Body() body) {
    const { event, data: { status, reference } } = body;
    if (event != "charge.success") return { message: "Unsupported event", status: "error" };
    if (status != "success") return { message: "Unsuccessful transaction", status: "error" };
    return this.transactionService.processTransaction(reference);
  }
}
