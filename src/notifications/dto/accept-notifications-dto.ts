import { PartialType } from "@nestjs/swagger";
import { DeviceState } from "@prisma/client";
import { IsString, IsEnum, IsOptional } from "class-validator";

export class UserDeviceDto {
  @IsString()
  deviceType: string;

  @IsString()
  deviceToken: string;

  @IsEnum(DeviceState)
  @IsOptional()
  status?: DeviceState;
}
export class UserDeviceUpdateDto extends PartialType(UserDeviceDto) {}
