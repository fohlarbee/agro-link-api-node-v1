// wallet.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

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

export class TransferDto extends FundWalletDto {
  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  toWalletId: number;

  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  fromWalletId: number;

  @ApiProperty({ required: true, type: String })
  @IsString()
  pin: string;
}

export class createWalletPinDto {
  @ApiProperty({ required: true, type: String })
  @IsString()
  pin: string;
}

export class ExpressDto {
  @ApiProperty({ required: true, type: String })
  @IsString()
  action: string;

  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  amount: number;

  @ApiProperty({ required: true, type: String })
  @IsString()
  authorizationCode: string;

  @ApiProperty({ required: true, type: String })
  @IsString()
  deviceUUID: string;

  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  walletId: number;
}
