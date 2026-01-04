import { Request, Response, NextFunction } from "express";
import { env } from "../config/env";

type ApiScope = "website" | "bot" | "admin";

const apiKeys: Record<string, ApiScope> = {
  [env.API_KEY_WEBSITE!]: "website",
  [env.API_KEY_DISCORD!]: "bot"
};

export interface ScopedRequest extends Request {
  apiScope?: ApiScope
}

export function requireApiKey(
  req: ScopedRequest, 
  res: Response, 
  next: NextFunction 
) {
  const key = req.header("X-api-key");

  if (!key) {
    return res.status(401).json({ error: "Missing API key" });
  }

  const scope = apiKeys[key];

  if (!scope) {
    return res.status(401).json({ error: "Invalid API key" });
  }

  req.apiScope = scope;
  next();
}