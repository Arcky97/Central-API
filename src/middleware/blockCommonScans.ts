import { NextFunction, Request, Response } from "express";
import app from "../app";

const blockedPaths = new Set([
  "/.env",
  "/HNAP1",
  "/wp-admin",
  "phpmyadmin",
  "/.git",
  "/config.json",
  "/server-status"
]);

export function blockCommonScans(req: Request, res: Response, next: NextFunction) {
  const path = req.path.toLowerCase();

  if (
    blockedPaths.has(path) ||
    req.method === "PROPFIND"
  ) {
    return res.sendStatus(404);
  }

  next();
};