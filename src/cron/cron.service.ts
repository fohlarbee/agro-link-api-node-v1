import { Cron, CronExpression } from "@nestjs/schedule";
import { HttpService } from "@nestjs/axios";
import { Injectable, ServiceUnavailableException } from "@nestjs/common";

@Injectable()
export class CronService {
  constructor(private readonly httpService: HttpService) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async callServer() {
    try {
      await this.httpService.get("http://localhost:4000/v2");
    } catch (error) {
      if (error instanceof Error) {
        throw new ServiceUnavailableException("Service not available");
      }
    }
    ``;
  }
}
