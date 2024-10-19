import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateOTPDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  generatedOTP: string;

  @IsString()
  @IsNotEmpty()
  subject?: string;

  @IsString()
  @IsNotEmpty()
  purpose?: string;

  @IsString()
  name?: string;
}
