import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";

export enum BusinessType {
  agroFarm = "agroFarm",
}
export class CreateBusinessDto {
  @IsString()
  @ApiProperty({ required: true })
  name: string;

  @IsString()
  @ApiProperty({ required: true })
  cacNumber: string;

  @IsPhoneNumber()
  @ApiProperty({ required: true })
  phoneNumber: string;

  @IsEnum(BusinessType)
  @IsString()
  @ApiProperty({ required: true })
  type: BusinessType;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  email?: string;
}
