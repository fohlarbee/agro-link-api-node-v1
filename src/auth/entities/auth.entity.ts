import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

class AccessToken {
  @ApiProperty()
  accessToken: string;
}

export class AuthEntity {
  @ApiProperty()
  message: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  role: string;

  @ApiProperty({ required: false })
  business_id: number;

  @Type(() => AccessToken)
  @ApiProperty()
  @ValidateNested()
  data: AccessToken;
}

export class SignupResponseEntity {}
