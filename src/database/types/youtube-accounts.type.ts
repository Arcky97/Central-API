export interface YoutubeAccountRow {
  id: number;
  authUserId: number;
  googleUserId: string;
  channelId: string;
  channelName: string;
  accessToken: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create DTO
export type CreateYoutubeAccount = Omit<YoutubeAccountRow, "id" | "createdAt" | "updatedAt">;

// Update DTO
export type UpdateYoutubeAccount = Partial<CreateYoutubeAccount>;

// Public DTO
export type PublicYoutubeAccount = Omit<YoutubeAccountRow, "accessToken" | "refreshToken">;