export interface ApiRequest {
  id: number;
  time: Date;
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
