export interface YoutubeVideoRow {
  id: number;

  channelId: number;
  goalProfileId: number | null;

  youtubeVideoId: string;

  title: string;
  thumbnailUrl: string | null;

  series: string | null;
  episodeNumber: number | null;

  publishedAt: Date;

  trackAnalytics: number;

  createdAt: Date;
  updatedAt: Date;
}

// Create DTO
export interface CreateYoutubeVideo {
  channelId: number;
  goalProfileId?: number | null;

  youtubeVideoId: string;

  title: string;
  thumbnailUrl: string | null;

  series?: string | null;
  episodeNumber?: number | null;

  publishedAt: Date;

  trackAnalytics?: boolean;
}

// Update DTO
export type UpdateYoutubeVideo = Partial<CreateYoutubeVideo>;

// Public DTO
export type PublicYoutubeVideo = Omit<YoutubeVideoRow, "trackAnalytics"> & {
  trackAnalytics: boolean;
}