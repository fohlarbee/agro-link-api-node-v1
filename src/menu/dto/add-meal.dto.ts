import { ApiProperty } from "@nestjs/swagger";
import { IsCurrency, IsDecimal, IsNegative, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class AddMealDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ required: true })
    name: string

    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
    @Min(100.00)
    @ApiProperty()
    price: number

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    image: string
}
