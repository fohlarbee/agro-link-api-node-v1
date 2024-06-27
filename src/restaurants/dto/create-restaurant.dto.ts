import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @ApiProperty({ required: true })
  name: string;

  @IsString()
  @ApiProperty({ required: true })
  cacNumber: string;

  @IsPhoneNumber()
  @ApiProperty({ required: true })
  phoneNumber: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ required: false, nullable: true })
  email?: string;
}
