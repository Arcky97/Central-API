export interface ApiAuthFailure {
  id: number;
  timeStamp: string;
  reason: string;
  method: string;
  route: string;
  ip: string;
  userAgent: string;
}

// Create DTO
export type CreateApiAuthFailure = Omit<ApiAuthFailure, "id">