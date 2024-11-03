import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsString } from "class-validator";

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

  @IsString()
  @ApiProperty({ required: true })
  phoneNumber: string;

  @IsEnum(BusinessType)
  @IsString()
  @ApiProperty({ required: true })
  type: BusinessType;

  @IsEmail()
  @ApiProperty({ required: false, nullable: false })
  email?: string;

  @IsString()
  @ApiProperty({ required: false, nullable: false })
  address?: string; // This is a nullable field
}
