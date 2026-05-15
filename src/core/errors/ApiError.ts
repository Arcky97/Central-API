import { ApiErrorCode } from "../constants/apiErrors";

export class ApiError extends Error {
  statusCode: number;
  code: ApiErrorCode;

  constructor(
    statusCode: number,
    code: ApiErrorCode, 
    message: string 
  ) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}