import { Module } from "@nestjs/common";
import { MonnifyService } from "./monnify.service";
import { CacheService } from "src/utils/services/cache.service";

@Module({
  imports: [],
  providers: [MonnifyService, CacheService],
  exports: [MonnifyService],
})
export class MonnifyModule {}
