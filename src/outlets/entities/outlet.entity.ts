import { Outlet } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "src/app/entities/BaseResponse.entity";
import { ValidateNested } from "class-validator";

class OutletEntity implements Partial<Outlet> {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  address: string;
}

class DataEntity {
  @ApiProperty()
  @ValidateNested()
  outlet: OutletEntity;
}

export class OutletCreationResponse extends BaseResponse {
  @ApiProperty()
  @ValidateNested()
  data: DataEntity;
}

export class OutletListResponse extends BaseResponse {
  @ValidateNested()
  @ApiProperty({ isArray: true })
  data: OutletEntity;
}
