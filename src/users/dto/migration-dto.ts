import { Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsEmail,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";

export class PurchasedOrderHistoryDTO {
  @IsNumber()
  id: number;

  @IsString()
  status: string;

  @IsString()
  reference: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  tip: number;

  @IsNumber()
  quantity: number;

  @IsDate()
  paidAt: Date;

  @IsDate()
  createdAt: Date;
}

export class GuestUserMigrationDTO {
  @IsString()
  guestUsername: string;

  @IsDate()
  guestCreatedAt: Date;

  @IsEmail()
  registeredUserEmail: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchasedOrderHistoryDTO)
  purchasedOrderHistory: PurchasedOrderHistoryDTO[];
}
