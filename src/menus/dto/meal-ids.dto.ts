import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class mealIdsDto {
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @ApiProperty({ required: true, isArray: true, type: Number })
  mealIds: number[];
}
