export interface YoutubeVideoSnapshotRow {
  id: number;

  videoId: number;

  snapshotDate: Date;

  views: number;
  likes: number;
  comments: number;
  shares: number;

  watchHours: number;

  averageViewDuration: number;

  averageViewPercentage: number;

  subscribersGained: number;

  subscribersLost: number;
}

// Create DTO
export interface CreateYoutubeVideoSnapshot {
  videoId: number;

  views: number;
  likes: number;
  comments: number;
  shares: number;

  watchHours?: number | null;

  averageViewDuration?: number | null;

  averageViewPercentage?: number | null;

  subscribersGained?: number | null;

  subscribersLost?: number | null;

  snapshotDate: Date;
}

// Update DTO
export type UpdateYoutubeVideoSnapshot = Partial<CreateYoutubeVideoSnapshot>;

// Public DTO
export type PublicYoutubeVideoSnapshot = YoutubeVideoSnapshotRow;