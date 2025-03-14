import { ApiProperty } from "@nestjs/swagger";
import { BusinessRoles } from "@prisma/client";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from "class-validator";
import { Role } from "src/auth/dto/auth.dto";

export class _CreateStaffDto {
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

  @IsEnum(Role)
  @IsString()
  @ApiProperty({ required: true })
  role: BusinessRoles;
}
