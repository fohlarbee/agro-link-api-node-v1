import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {}

  async set(key: string, value: any, ttl: number = null) {
    if (ttl) return this.cache.set(key, value, ttl);
    return this.cache.set(key, value);
  }
  async get(key: string) {
    return this.cache.get(key);
  }

  async delete(key: string) {
    return this.cache.del(key);
  }
}
