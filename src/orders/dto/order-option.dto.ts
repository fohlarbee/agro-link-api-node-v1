import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from "class-validator";

export class AddOptionToOrderDto {
  @IsNumber()
  @Min(1)
  @ApiProperty()
  optionId: number;

  @IsNumber()
  @Min(1)
  @ApiProperty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  tableIdentifier: string;

  @IsNumber()
  @Min(0)
  @ApiProperty()
  tip: number;
}

export class AddOptionsToOrderDto {
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AddOptionToOrderDto)
  @ApiProperty({ type: [AddOptionToOrderDto] })
  options: AddOptionToOrderDto[];
}

///////////////////////////////////////////////////

export class OrderDto {
  @ApiProperty()
  items: OrderItemDto[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  tableIdentifier: string;

  @IsNumber()
  @Min(0)
  @ApiProperty()
  tip?: number;
}

export class OrderItemDto {
  @IsNumber()
  @ApiProperty()
  optionId: number;

  @IsNumber()
  @Min(1)
  @ApiProperty()
  quantity: number;
}
