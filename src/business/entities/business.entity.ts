import { Business } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "src/app/entities/BaseResponse.entity";
import { Type } from "class-transformer";
import { IsEnum, ValidateNested } from "class-validator";
import { BusinessType } from "../dto/create-business.dto";

class BusinessEntity implements Business {
  @ApiProperty()
  id: number;

  @ApiProperty({ required: true, minLength: 5 })
  name: string;

  @ApiProperty({ required: true, minLength: 8, maxLength: 9 })
  cacNumber: string;

  @ApiProperty({ required: true })
  phoneNumber: string;

  @ApiProperty({ required: false })
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @IsEnum(BusinessType)
  @ApiProperty({ required: true })
  type: BusinessType;

  @ApiProperty()
  creatorId: number;
}

export class BusinessCreationResponse extends BaseResponse {
  @Type(() => BusinessEntity)
  @ApiProperty()
  @ValidateNested()
  data: { business: BusinessEntity };
}
class BusinessListEntity implements Partial<Business> {
  @ApiProperty({ readOnly: true })
  id: number;

  @ApiProperty({ required: true, readOnly: true })
  name: string;

  @ApiProperty({ required: true, readOnly: true })
  address: string;

  @ApiProperty({ required: true, readOnly: true })
  phoneNumber: string;
}

export class BusinessListResponse extends BaseResponse {
  @ValidateNested()
  @ApiProperty({ isArray: true })
  data: BusinessListEntity;
}
