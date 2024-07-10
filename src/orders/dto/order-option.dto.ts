import { ApiProperty } from '@nestjs/swagger';
import {  IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AddOptionToOrderDto {
  @IsNumber()
  @Min(1)
  @ApiProperty()
  optionId: number;

  @IsNumber()
  @Min(1)
  @ApiProperty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  tableIdentifier: string;

  
}
