import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum } from "class-validator";

export enum Channels {
  CASH = "CASH",
  POS = "POS",
}

export class ConfirmationDto {
  @IsBoolean()
  @ApiProperty()
  completed: boolean;

  @IsEnum(Channels)
  @ApiProperty({
    description: "Payment channel",
    enum: Channels,
  })
  channel?: Channels;
}
