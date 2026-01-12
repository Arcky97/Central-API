import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";
import { LogAuthFailure } from "../security/authLogger";

type ApiScope = "website" | "bot" | "admin";

const apiKeys: Record<string, ApiScope> = {
  [env.API_KEY_WEBSITE!]: "website",
  [env.API_KEY_DISCORD!]: "bot",
  ...(env.API_KEY_ADMIN ? { [env.API_KEY_ADMIN]: "admin" } : {})
};

export interface ScopedRequest extends Request {
  apiScope?: ApiScope
}

function isLocalRequest(req: Request): boolean {
  const ip = req.ip;

  if (!ip) return false;

  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("::ffff:127.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.")
  );
}

export function requireApiKey(
  req: ScopedRequest, 
  res: Response, 
  next: NextFunction 
) {
  const key = req.header("X-api-key");

  if (!key) {
    LogAuthFailure(req, "missing_key");
    return res.status(401).json({ error: "Missing API key" });
  }

  const scope = apiKeys[key];

  if (!scope) {
    LogAuthFailure(req, "invalid_key");
    return res.status(401).json({ error: "Invalid API key" });
  }

  if (scope === "admin" && !isLocalRequest(req)) {
    return res.status(403).json({ error: "Admin API key is local-only" });
  }

  req.apiScope = scope;
  next();
}