import { Shift } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "src/app/entities/BaseResponse.entity";
import { Type } from "class-transformer";
import { IsArray, IsString, ValidateNested } from "class-validator";

class ShiftEntity implements Shift {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: false })
  outletId: number;

  @ApiProperty({ required: true })
  periods: PeriodDto[];

  createdAt: Date;
  updatedAt: Date;
  businessId: number;
  userId: number;
  roleId: number;
  active: boolean;
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

export class PeriodDto {
  @ApiProperty({ example: ["Monday, Tuesday, Wednesday"] })
  @IsArray()
  @IsString()
  day: string;

  @ApiProperty({ example: "08:00:00" })
  @IsString()
  startTime: Date;

  @ApiProperty({ example: "17:00:00" })
  @IsString()
  endTime: Date;
}

enum Day {
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
  Sunday = "Sunday",
}
