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

  watchHours?: number;

  averageViewDuration?: number;

  impressions?: number;

  clickThroughRate?: number;

  subscribersGained?: number;
}

// Update DTO
export type UpdateYoutubeVideoSnapshot = Partial<CreateYoutubeVideoSnapshot>;

// Public DTO
export type PublicYoutubeVideoSnapshot = YoutubeVideoSnapshotRow;