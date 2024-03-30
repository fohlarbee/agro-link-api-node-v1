import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

export class AddMealToOrderDto {
    @IsNumber()
    @Min(1)
    @ApiProperty()
    mealId: number

    @IsNumber()
    @Min(1)
    @ApiProperty()
    quantity: number
}