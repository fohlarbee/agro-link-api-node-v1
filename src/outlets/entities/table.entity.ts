import { Table } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";
import { BaseResponse } from "src/app/entities/BaseResponse.entity";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

class TableEntity implements Table {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  identifier: string;

  outletId: number;

  createdAt: Date;

  updatedAt: Date;
}

class DataEntity {
  @ApiProperty()
  @ValidateNested()
  outlet: TableEntity;
}

export class TableCreationResponse extends BaseResponse {
  @Type(() => TableEntity)
  @ApiProperty()
  @ValidateNested()
  data: DataEntity;
}
class TableListEntity implements Partial<Table> {
  @ApiProperty({ readOnly: true })
  id: number;

  @ApiProperty({ required: true, readOnly: true })
  identifier: string;
}

export class TableListResponse extends BaseResponse {
  @ValidateNested()
  @ApiProperty({ isArray: true })
  data: TableListEntity;
}
