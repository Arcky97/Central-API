import { Response, NextFunction } from "express";
import { ScopedRequest } from "./apiKey";

export function requireScope(...allowedScopes: Array<"website" | "bot" | "admin">) {
  return (req: ScopedRequest, res: Response, next: NextFunction) => {
    if (!req.apiScope || !allowedScopes.includes(req.apiScope)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}