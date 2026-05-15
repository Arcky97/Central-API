import { QueryOptions } from "mysql2";

export class DatabaseError extends Error {
  query?: QueryOptions | undefined;
  originalError?: unknown;

  constructor(
    message: string,
    options?: {
      query?: QueryOptions;
      originalError?: unknown
    }
  ) {
    super(message);

    this.name = "DatabaseError";

    this.query = options?.query;
    this.originalError = options?.originalError;

    Error.captureStackTrace(this, this.constructor);
  }
}