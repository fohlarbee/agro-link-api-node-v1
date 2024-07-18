import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

enum MenuType {
  starters = "starters",
  breakfast = "breakfast",
  lunch = "lunch",
  dinner = "dinner",
  mains = "mains",
}

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  name: string;

  @IsEnum(MenuType)
  @ApiProperty({ required: true })
  menuType: MenuType;
}
