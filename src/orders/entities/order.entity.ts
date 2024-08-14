import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "src/app/entities/BaseResponse.entity";

export class FindOpenOrdersResponse extends BaseResponse {
  @ApiProperty({ required: true })
  data: {
    orders: any;
  };
}
