import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOutletDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  address: string;
}
