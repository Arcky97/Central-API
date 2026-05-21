import { Redis } from "ioredis";
import { env } from "./config/env";

export const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("ready", () => console.log("Redis ready"));
redis.on("error", err => console.error("Redis error:", err));
redis.on("end", () => console.log("Redis connection closed"));