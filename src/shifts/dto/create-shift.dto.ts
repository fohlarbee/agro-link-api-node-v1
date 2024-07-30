import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class CreateShiftDto {
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
}
