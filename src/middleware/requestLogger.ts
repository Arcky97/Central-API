import { Response, NextFunction } from "express";
import { ScopedRequest } from "./apiKey";
import { apiRequestsQueue } from "../queue/api-requests.queue";
import { getStringifiedTimeStamp } from "../utils/dateTimeStringifier";
import { logFailure, logInfo, logSuccess } from "../database/sync/logger";

export function requestLogger(
  req: ScopedRequest,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - start;

    const ip =
      req.ip ||
      req.socket?.remoteAddress ||
      "0.0.0.0";

    const log = {
      timeStamp: getStringifiedTimeStamp(),
      method: req.method,
      route: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
      ip,
      scope: req.apiScope ?? "unknown",
      userAgent: req.get("user-agent") ?? "unknown"
    };

    logInfo(
      `[REQUEST LOG] ${log.status} ${log.method} ${log.route} | ip=${log.ip} | scope=${log.scope} | ${log.durationMs}ms`
    );

    try {
      await apiRequestsQueue.add("api-request", log);
      logSuccess("api-request queue add.");
    } catch (err) {
      logFailure("api-request queue add:", err);
    }
  });

  next();
}