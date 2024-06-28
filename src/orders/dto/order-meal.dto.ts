/* eslint-disable prettier/prettier */
<<<<<<< HEAD
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
=======
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
>>>>>>> d846499 (Prisma relationship conflict)

export class AddMealToOrderDto {
  @IsNumber()
  @Min(1)
  @ApiProperty()
  mealId: number;

  @IsNumber()
  @Min(1)
  @ApiProperty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  tableIdentifier: string;
}
