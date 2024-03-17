import { Controller, Get } from '@nestjs/common';
import { BASE_MESSAGE } from '../configs/messages';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthResponse } from './entities/HealthResponse.entity';


@Controller()
@ApiTags("/")
export class AppController {
  constructor() {}

  @Get()
  @ApiOkResponse({ type: HealthResponse })
  getBaseMessage(): HealthResponse {
    return { message: BASE_MESSAGE, status: "success" };
  }
}
