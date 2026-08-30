export type YoutubeChannelAnalyticsSnapshotRow = {
  id: number;
  channelId: string;
  views: number;
  watchHours: number;
  subscribersGained: number;
  subscribersLost: number;
  snapshotDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Create DTO
export type CreateYoutubeChannelAnalyticsSnapshot = Omit<YoutubeChannelAnalyticsSnapshotRow, "id" | "createdAt" | "updatedAt">;

// Update DTO
export type UpdateYoutubeChannelAnalyticsSnapshot = Partial<CreateYoutubeChannelAnalyticsSnapshot>;

// Public DTO
export type PublicYoutubeChannelAnalyticsSnapshot = YoutubeChannelAnalyticsSnapshotRow;