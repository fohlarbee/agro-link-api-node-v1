import { ApiProperty } from "@nestjs/swagger";
import { GuardRoles } from "@prisma/client";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from "class-validator";

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

  @IsEnum(GuardRoles)
  @ApiProperty({ required: true })
  role: GuardRoles;
}
