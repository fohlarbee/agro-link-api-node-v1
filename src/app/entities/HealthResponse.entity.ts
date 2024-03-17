import { ApiProperty } from "@nestjs/swagger";

type status = "success"|"error";

export class HealthResponse {
    @ApiProperty({ required: true })
    message: string;

    @ApiProperty({ required: true })
    status: status;
}