import { Restaurant } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/app/entities/BaseResponse.entity';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

class RestaurantEntity implements Restaurant {
    @ApiProperty()
    id: number;

    @ApiProperty({ required: true, minLength: 5 })
    name: string

    @ApiProperty({ required: true, minLength: 8, maxLength: 9 })
    cacNumber: string

    @ApiProperty({ required: true })
    phoneNumber: string

    @ApiProperty({ required: false })
    email: string

    @ApiProperty({ required: true })
    address: string

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    ownerId: number;
}

export class RestaurantCreationResponse extends BaseResponse {
    @Type(() => RestaurantEntity)
    @ApiProperty()
    @ValidateNested()
    data: { restaurant: RestaurantEntity }
    // restaurant: 
}
class RestaurantListEntity implements Partial<Restaurant> {
    @ApiProperty({ readOnly: true })
    id: number;

    @ApiProperty({ required: true, readOnly: true })
    name: string

    @ApiProperty({ required: true, readOnly: true })
    address: string

    @ApiProperty({ required: true, readOnly: true })
    phoneNumber: string
}

export class RestaurantListResponse extends BaseResponse {
    @ValidateNested()
    @ApiProperty({ isArray: true })
    data: RestaurantListEntity
}


