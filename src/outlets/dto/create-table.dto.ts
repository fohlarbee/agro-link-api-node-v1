import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateTableDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    identifier: string;
}
