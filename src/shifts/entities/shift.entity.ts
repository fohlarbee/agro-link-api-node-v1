import { Shift } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "src/app/entities/BaseResponse.entity";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

class ShiftEntity implements Shift {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  startTime: Date;

  @ApiProperty({ required: true })
  endTime: Date;

  @ApiProperty({ required: false })
  outletId: number;

  createdAt: Date;
  updatedAt: Date;
  businessId: number;
  userId: number;
  roleId: number;
}

export class ShiftCreationResponse extends BaseResponse {
  @Type(() => ShiftEntity)
  @ApiProperty()
  @ValidateNested()
  data: { shift: ShiftEntity };
}
class ShiftListEntity implements Partial<Shift> {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  startTime: Date;

  @ApiProperty({ required: true })
  endTime: Date;

  @ApiProperty({ required: false })
  outletId: number;
}

export class ShiftListResponse extends BaseResponse {
  @ValidateNested()
  @ApiProperty({ isArray: true })
  data: ShiftListEntity[];
}
