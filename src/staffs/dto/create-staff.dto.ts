import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from "class-validator";

export class CreateStaffDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  name: string;

  @IsNumber()
  @IsPositive()
  @ApiProperty({ required: true })
  roleId: number;
}
