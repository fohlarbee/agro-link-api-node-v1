import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from "class-validator";

export class CreateShiftDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty({ required: false })
  outletId: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ required: true })
  userId: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ required: true })
  roleId: number;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({ required: true })
  periods: PeriodDto[];
}

export class PeriodDto {
  @ApiProperty({
    example: ["Mon, Tue, Wed", "Thur", "Fri", "Sat", "Sun"],
    required: true,
  })
  @IsString()
  day: string;

  @ApiProperty({ example: "08:00:00" })
  @IsString()
  startTime: string;

  @ApiProperty({ example: "17:00:00" })
  @IsString()
  endTime: string;
}

export class UpdatePeriodDto extends PeriodDto {}
