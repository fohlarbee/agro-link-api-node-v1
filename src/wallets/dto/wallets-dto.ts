// wallet.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export enum OwnerType {
  Business = "BUSINESS",
  Customer = "CUSTOMER",
  Waiter = "WAITER",
  KitchenStaff = "KITCHEN_STAFF",
}

export class FundWalletDto {
  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  amount: number;
}
