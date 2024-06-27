import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

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
