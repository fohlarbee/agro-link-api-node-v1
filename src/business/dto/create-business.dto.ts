/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsPhoneNumber, IsString } from 'class-validator';



enum BusinessTYpe{
  business='business',
  bar='bar'
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

  @IsEnum(BusinessTYpe)
  @IsString()
  @ApiProperty({ required: true })
  type: BusinessTYpe
  
  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  email?: string;
}
