import { Module } from "@nestjs/common";
import { SecretsService } from "./secrets.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  providers: [SecretsService],
  exports: [SecretsService],
})
export class SecretsModule {}
