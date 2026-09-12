export interface YoutubeVideoRow {
  id: number;

  channelId: number;
  goalProfileId: number | null;

  videoId: string;

  title: string;
  thumbnailUrl: string | null;

  durationSeconds: number;

  isShort: number;
  isShortOverride: number | null;

  description: string | null;

  playlistIds: string[] | null;

  publishedAt: Date;

  trackAnalytics: number;

  createdAt: Date;
  updatedAt: Date;
}

// Create DTO
export interface CreateYoutubeVideo {
  channelId: number;
  goalProfileId?: number | null;

  videoId: string;

  title: string;
  thumbnailUrl: string | null;

  durationSeconds: number;

  isShort: boolean;
  isShortOverride?: boolean | null;

  description?: string | null;

  playlistIds?: string[] | null;

  series?: string | null;
  episodeNumber?: number | null;

  publishedAt: Date;

  trackAnalytics?: boolean;
}

// Update DTO
export type UpdateYoutubeVideo = Partial<CreateYoutubeVideo>;

// Public DTO
export type PublicYoutubeVideo = Omit<YoutubeVideoRow, "trackAnalytics" | "isShort" | "isShortOverride"> & {
  trackAnalytics: boolean;
  isShort: boolean;
  isShortOverride: boolean | null;
}