import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/app/entities/BaseResponse.entity';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class RoleEntity implements Partial<Role> {
    @ApiProperty({ required: true })
    id: number;

    @ApiProperty({ required: true })
    name: string
}

export class RoleCreationResponse extends BaseResponse {
    @Type(() => RoleEntity)
    @ApiProperty()
    @ValidateNested({ each: true })
    data: { role: RoleEntity }
}

export class RoleListResponse extends BaseResponse {
    @ValidateNested({ each: true })
    @ApiProperty({ isArray: true })
    data: RoleEntity
}