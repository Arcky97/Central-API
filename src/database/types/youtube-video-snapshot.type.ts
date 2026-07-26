export interface YoutubeVideoSnapshotRow {
  id: number;

  videoId: number;

  recordedAt: Date;

  views: number;
  likes: number;
  comments: number;

  watchHours: number;

  averageViewDuration: number;

  impressions: number;

  clickThroughRate: number;

  subscribersGained: number;
}

// Create DTO
export interface CreateYoutubeVideoSnapshot {
  videoId: number;

  views: number;
  likes: number;
  comments: number;

  watchHours?: number | null;

  averageViewDuration?: number | null;

  impressions?: number | null;

  clickThroughRate?: number | null;

  subscribersGained?: number | null;

  snapshotDate: Date;
}

// Update DTO
export type UpdateYoutubeVideoSnapshot = Partial<CreateYoutubeVideoSnapshot>;

// Public DTO
export type PublicYoutubeVideoSnapshot = YoutubeVideoSnapshotRow;