import { Controller, Get } from "@nestjs/common";
import { BASE_MESSAGE } from "../configs/messages";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { BaseResponse } from "./entities/BaseResponse.entity";

@Controller()
@ApiTags("/")
export class AppController {
  

  @Get()
  @ApiOkResponse({ type: BaseResponse })
  async getBaseMessage(): Promise<BaseResponse | any> {
    return { message: BASE_MESSAGE, status: "success" };
  }
}
