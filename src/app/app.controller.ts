import { Controller, Get } from "@nestjs/common";
import { BASE_MESSAGE } from "../configs/messages";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { BaseResponse } from "./entities/BaseResponse.entity";
import { SecretsService } from "src/secrets/secrets.service";

@Controller()
@ApiTags("/")
export class AppController {
  constructor(private readonly secretService: SecretsService) {}

  @Get()
  @ApiOkResponse({ type: BaseResponse })
  async getBaseMessage(): Promise<BaseResponse | any> {
    await this.secretService.getMhcpApiToken();
    // await this.secretService.getSecrets()
    await this.secretService.getSecret("PORT");
    return { message: BASE_MESSAGE, status: "success" };
  }
}
