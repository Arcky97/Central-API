import { Redis } from "ioredis";
import { env } from "./config/env";
import { logError, logInfo, logSuccess } from "./database/sync/logger";

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null
});

redis.on("connect", () => logSuccess("Redis connected"));
redis.on("ready", () => logInfo("Redis ready"));
redis.on("error", err => logError("Redis error:", err));
redis.on("end", () => logInfo("Redis connection closed"));