import { Controller, Get } from '@nestjs/common';
import { BASE_MESSAGE } from '../configs/messages';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from './entities/BaseResponse.entity';


@Controller()
@ApiTags("/")
export class AppController {
  constructor() {}

  @Get()
  @ApiOkResponse({ type: BaseResponse })
  getBaseMessage(): BaseResponse {
    return { message: BASE_MESSAGE, status: "success" };
  }
}
