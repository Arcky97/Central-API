import { Request } from "express";
import { query } from "../database/query";

export function LogAuthFailure(
  req: Request,
  reason: "missing_key" | "invalid_key"
) {
  const log = {
    time: new Date(),
    reason,
    method: req.method,
    route: req.originalUrl,
    ip: req.ip || "unknown IP",
    userAgent: req.get("user-agent") ?? "unknown"
  };

  console.warn(
    `[AUTH FAIL] ${log.reason} | ${log.method} ${log.route} | ip=${log.ip} | ua=${log.userAgent}`
  );

  try {
    query("auth",
     { sql: `INSERT INTO ApiAuthFailures
      (timestamp, reason, method, route, ip, userAgent)
      VALUES(?, ?, ?, ?, ?, ?)` },
      [log.time, log.reason, log.method, log.route, log.ip, log.userAgent]
    )
  } catch (error) {
    console.error("Failed to log auth failure to database:", error); 
  }
}