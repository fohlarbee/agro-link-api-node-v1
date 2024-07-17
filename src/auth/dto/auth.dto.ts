import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  password: string;
}

export class AuthDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  name: string;
}

export class SendVRegistrationEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  email: string;
}

export class VerificationDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  otp: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  email: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  newPassword: string;
}
