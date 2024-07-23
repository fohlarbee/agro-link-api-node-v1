import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

enum optionType {
  meal = "meal",
  drink = "drink",
}
export class CreateOptionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  name: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @Min(100)
  @ApiProperty({ required: true })
  price: number;

  @ApiProperty()
  image: string;

  @IsEnum(optionType)
  @IsString()
  @ApiProperty({ required: true })
  type: optionType;
}
