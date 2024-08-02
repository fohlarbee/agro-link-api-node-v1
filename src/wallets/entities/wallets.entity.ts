import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { BaseResponse } from "src/app/entities/BaseResponse.entity";

class WalletEntity {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  balance: number;

  @ApiProperty({ required: true })
  customerId: number;
}

export class WalletFetchResponse extends BaseResponse {
  @Type(() => WalletEntity)
  @ApiProperty()
  @ValidateNested({ each: true })
  data: { wallet: WalletEntity };
}

export class WalletListResponse extends BaseResponse {
  @ValidateNested({ each: true })
  @ApiProperty({ isArray: true })
  data: WalletEntity[];
}

export class DepositInitiationResponse extends BaseResponse {
  @ApiProperty({ required: true })
  data: {
    paymentLink: string;
    reference: string;
  };
}
