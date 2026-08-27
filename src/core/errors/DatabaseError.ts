import { QueryOptions } from "mysql2";

export class DatabaseError extends Error {
  query?: QueryOptions | undefined;
  params?: any;
  originalError?: unknown;

  constructor(
    message: string,
    options?: {
      query?: QueryOptions;
      params?: any;
      originalError?: unknown;
    }
  ) {
    const origMsg = options?.originalError instanceof Error
      ? options.originalError.message
      : (typeof options?.originalError === "object" && options?.originalError !== null && "message" in options.originalError)
        ? String((options.originalError as any).message)
        : "";

    const fullMessage = origMsg
      ? `${message} Cause: ${origMsg}`
      : message;

    super(fullMessage);

    this.name = "DatabaseError";

    this.query = options?.query;
    this.params = options?.params;
    this.originalError = options?.originalError;

    Error.captureStackTrace(this, this.constructor);
  }
}