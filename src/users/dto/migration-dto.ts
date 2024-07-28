import { ApiProperty } from "@nestjs/swagger";
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
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  reference: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsDate()
  paidAt: Date;

  @ApiProperty()
  @IsDate()
  createdAt: Date;
}

export class GuestUserMigrationDTO {
  @ApiProperty()
  @IsString()
  guestUsername: string;

  @ApiProperty()
  @IsDate()
  guestCreatedAt: Date;

  @ApiProperty()
  @IsEmail()
  registeredUserEmail: string;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchasedOrderHistoryDTO)
  purchasedOrderHistory: PurchasedOrderHistoryDTO[];
}
