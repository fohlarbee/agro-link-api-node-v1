import { ApiProperty } from "@nestjs/swagger";
import { BusinessRoles } from "@prisma/client";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  name: BusinessRoles;
}
