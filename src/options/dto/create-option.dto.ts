import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

enum optionType {
  meal = "meal",
  drink = "drink"
}
export class CreateOptionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  name: string;

  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @Min(100.0)
  @ApiProperty()
  price: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  image: string;

  @IsEnum(optionType)
  @IsString()
  @ApiProperty({ required: true })
  type: optionType;
}
