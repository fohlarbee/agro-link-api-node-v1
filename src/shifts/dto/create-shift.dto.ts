import { ApiProperty } from "@nestjs/swagger";
// import { Transform } from "class-transformer";
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

  // @IsNotEmpty()
  // @Transform(({ value }) => new Date(value))
  // @IsDate()
  // @ApiProperty({ required: true })
  // startTime: Date;

  // @IsNotEmpty()
  // @Transform(({ value }) => new Date(value))
  // @IsDate()
  // @ApiProperty({ required: true })
  // endTime: Date;

  @ApiProperty({ required: false, type: Date })
  get startTime(): Date | null {
    if (!this.periods || this.periods.length === 0) return null;
    const earliestTime = this.periods
      .map((period) => new Date(`1970-01-01T${period.startTime}:00Z`))
      .reduce((earliest, time) => (time < earliest ? time : earliest));
    return earliestTime;
  }

  @ApiProperty({ required: false, type: Date })
  get endTime(): Date | null {
    if (!this.periods || this.periods.length === 0) return null;
    const latestTime = this.periods
      .map((period) => new Date(`1970-01-01T${period.endTime}:00Z`))
      .reduce((latest, time) => (time > latest ? time : latest));
    return latestTime;
  }
}

export class PeriodDto {
  @ApiProperty({
    example: ["Mon, Tue, Wed", "Thu", "Fri", "Sat", "Sun"],
    required: true,
  })
  @IsString()
  day: string;

  @ApiProperty({ example: "08:00" })
  @IsString()
  startTime: string;

  @ApiProperty({ example: "17:00" })
  @IsString()
  endTime: string;
}

export class UpdatePeriodDto extends PeriodDto {}
