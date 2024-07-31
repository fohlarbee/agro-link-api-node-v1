import { Cron, CronExpression } from "@nestjs/schedule";
import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CronService {
  constructor(private readonly httpService: HttpService) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async callServer() {
    try {
      const response: any = await this.httpService.get(
        "https://quik-quik-api-node-v2.onrender.com/v2",
      );
      console.log(response)
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error:", error.message);
      }
    }
    ``;
  }
}
