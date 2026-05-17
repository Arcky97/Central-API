export interface ApiRequest {
  id: number;
  timeStamp: string;
  method: string;
  route: string;
  status: number;
  durationMs: number;
  ip: string;
  scope: string;
  userAgent: string;
}

// Create DTO
export type CreateApiRequest = Omit<ApiRequest, "id">
