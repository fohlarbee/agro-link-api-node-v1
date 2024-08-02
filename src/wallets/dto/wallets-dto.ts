// wallet.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class FundWalletDto {
  @ApiProperty({ required: true, type: Number })
  @IsNumber()
  amount: number;
}
