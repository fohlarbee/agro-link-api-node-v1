import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, isPhoneNumber } from "class-validator";

export class CreateOutletDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    address: string
}
