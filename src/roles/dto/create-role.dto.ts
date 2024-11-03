import { ApiProperty } from "@nestjs/swagger";
import { BusinessRoles } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
  @IsEnum(BusinessRoles)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  name: BusinessRoles;
}
