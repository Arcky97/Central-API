import { Request, Response, NextFunction } from "express";
import { ScopedRequest } from "./apiKey";
import { query } from "../database";

export function requestLogger(
  req: ScopedRequest,
  res: Response,
  next: NextFunction
) {
  const start = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - start;

    const log = {
      time: new Date(),
      method: req.method,
      route: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
      ip: req.ip,
      scope: req.apiScope ?? "unknown",
      userAgent: req.get("user-agent") ?? "unknown"
    };

    console.log(
      `[REQUEST LOG] ${log.status} ${log.method} ${log.route} | ip=${log.ip} | scope=${log.scope} | ${log.durationMs}ms`
    );

    try {
      await query(
        `ÌNSERT INTO ApiRequestLogs
          (timestamp, method, route, status, durationMs, ip, scope, userAgent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          log.time,
          log.method,
          log.route,
          log.status,
          log.durationMs,
          log.ip,
          log.scope,
          log.userAgent
        ]
      );
    } catch (error) {
      console.error("Failed to log request to database:", error);
    }
  });

  next();
}