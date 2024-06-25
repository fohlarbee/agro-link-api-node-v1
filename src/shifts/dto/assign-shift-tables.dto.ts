import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsNumber, IsPositive } from "class-validator";

export class AssignShiftTablesDto {
    @IsNumber({}, { each: true })
    @IsPositive({ each: true })
    @ApiProperty({ required: true, isArray: true, type: Number })
    tableIds: number[];
}