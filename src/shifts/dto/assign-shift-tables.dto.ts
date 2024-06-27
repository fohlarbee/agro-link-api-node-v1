import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class AssignShiftTablesDto {
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @ApiProperty({ required: true, isArray: true, type: Number })
  tableIds: number[];
}
