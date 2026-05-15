import { NextFunction, Request, Response } from "express";
import { ApiError } from "../core/errors/ApiError";
import { DatabaseError } from "../core/errors/DatabaseError";
import { ZodError } from "zod";
import { API_ERRORS } from "../core/constants/apiErrors";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // 1. Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      code: API_ERRORS.INVALID_INPUT,
      message: err.message
    })
  }

  // 2. API errors (intentional HTTP errors)
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message
    });
  }

  // 3. Database errors (internal system failures)
  if (err instanceof DatabaseError) {
    console.error("DB ERROR:", err);

    return res.status(500).json({
      success: false,
      code: "DATABASE_ERROR",
      message: "Database operation failed"
    });
  }

  // 4. Unknown errors
  console.error("UNKNOWN ERROR:", err);

  return res.status(500).json({
    success: false,
    code: "INTERNAL_ERROR",
    message: "Something went wrong"
  });
}