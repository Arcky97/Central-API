import { Request } from "express";
import { apiAuthFailuresQueue } from "../queue/api-auth-failure.queue";
import { getStringifiedTimeStamp } from "../utils/dateTimeStringifier";
import { logFailure, logSuccess, logWarning } from "../database/sync/logger";

export async function LogAuthFailure(
  req: Request,
  reason: "missing_key" | "invalid_key"
) {

  const log = {
    timeStamp: getStringifiedTimeStamp(),
    reason,
    method: req.method,
    route: req.originalUrl,
    ip: req.ip || "unknown IP",
    userAgent: req.get("user-agent") ?? "unknown"
  };

  logWarning(
    `[AUTH FAIL] ${log.reason} | ${log.method} ${log.route} | ip=${log.ip} | ua=${log.userAgent}`
  );

  try {
    await apiAuthFailuresQueue.add("api-auth-failure", log);
    logSuccess("api-auth-failure queue add.");
  } catch (err) {
    logFailure("api-auth-failure queue add:", err);
  }
}