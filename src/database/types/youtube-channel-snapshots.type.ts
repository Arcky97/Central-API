export interface YoutubeChannelSnapshotRow {
  id: number;
  channelId: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  snapShotDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Create DTO
export type CreateYoutubeChannelSnapshot = Omit<YoutubeChannelSnapshotRow, "id" | "createdAt" | "updatedAt">;

// Update DTO
export type UpdateYoutubeChannelSnapshot = Partial<CreateYoutubeChannelSnapshot>;

// Public DTO
export type PublicYoutubeChannelSnapshot = YoutubeChannelSnapshotRow;