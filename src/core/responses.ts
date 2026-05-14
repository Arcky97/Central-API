export function apiSuccess(
  data?: unknown,
  message = "Success"
) {
  return {
    success: true,
    message,
    data
  };
}

export function apiError(
  message = "Internal Server Error"
) {
  return {
    success: false,
    message
  };
}