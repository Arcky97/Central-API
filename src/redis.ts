import { Redis } from "ioredis";

export const redis = new Redis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null
})

redis.on("connect", () => console.log("Redis connected"));
redis.on("ready", () => console.log("Redis ready"));
redis.on("error", (err) => console.error("Redis error:", err));
redis.on("end", () => console.log("Redis connection closed"));