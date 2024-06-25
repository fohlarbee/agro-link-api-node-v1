import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsPositive, MaxDate, MinDate } from "class-validator";

export class CreateShiftDto {
    @IsNotEmpty()
    @Transform( ({ value }) => new Date(value))
    @IsDate()
    @MinDate(new Date())
    @ApiProperty({ required: true })
    startTime: Date;
    
    @IsNotEmpty()
    @Transform( ({ value }) => new Date(value))
    @IsDate()
    @MinDate(new Date())
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
