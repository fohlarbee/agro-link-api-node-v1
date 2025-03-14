import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTableDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  identifier: string;
}
