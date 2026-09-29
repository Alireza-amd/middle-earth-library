import { serverEnv } from "@/data/env/server"
import { Redis } from "@upstash/redis"

export const redisClient = new Redis({
  url: serverEnv.UPSTASH_REDIS_REST_URL,
  token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
})