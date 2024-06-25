import { Staff, User } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/app/entities/BaseResponse.entity';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { RoleEntity } from 'src/roles/entities/role.entity';

class UserEntity implements Partial<User> {
    @ApiProperty({ required: true })
    id: number;

    @ApiProperty({ required: true })
    email: string;

    @ApiProperty({ required: true })
    name: string;
}


class StaffEntity {
    @ApiProperty({ required: true })
    @ValidateNested({ each: true })
    user: UserEntity;

    @ApiProperty({ required: true })
    @ValidateNested({ each: true })
    role: RoleEntity;
}

export class StaffFetchResponse extends BaseResponse {
    @Type(() => RoleEntity)
    @ApiProperty()
    @ValidateNested({ each: true })
    data: { staff: StaffEntity }
}

export class StaffListResponse extends BaseResponse {
    @ValidateNested({ each: true })
    @ApiProperty({ isArray: true })
    data: StaffEntity
}