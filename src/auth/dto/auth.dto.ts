import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from "class-validator";

export enum Role {
  customer = "customer",
  admin = "admin",
  waiter = "waiter",
  manager = "manager",
  kitchen = "kitchen",
  owner = "owner",
  guest = "guest",
}
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

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  deviceUUID: string;
}

export class AuthDto extends LoginDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  name: string;

  @ApiProperty()
  imageURL: string;

  @ApiProperty()
  avatar?: string;

  @IsEnum(Role)
  @IsString()
  @ApiProperty({ required: true })
  role?: Role;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  deviceUUID: string;

  // @ApiProperty()
  // isCustomer?: boolean;
}

export class SendRegistrationEmailDto {
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
export class ResetDeviceUUIDDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  deviceUUID: string;
}
