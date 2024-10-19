import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsArray,
  IsDate,
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

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty({ required: true })
  startTime: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty({ required: true })
  endTime: Date;
}

export class PeriodDto {
  @ApiProperty({
    example: ["Mon, Tue, Wed", "Thu", "Fri", "Sat", "Sun"],
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
