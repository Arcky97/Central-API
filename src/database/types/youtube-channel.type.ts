export interface YoutubeChannelRow {
  id: number,

  channelId: string;
  channelName: string;
  description: string;
  thumbnailUrl: string;
  customUrl: string;
  publishedAt: Date;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;

  createdAt: Date;
  updatedAt: Date;
}

// Create DTO
export interface CreateYoutubeChannel {
  channelId: string;
  channelName: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  customUrl?: string | null;
  publishedAt?: Date | null;
  subscriberCount?: number | null;
  viewCount?: number | null;
  videoCount?: number | null;
}

// Update DTO
export type UpdateYoutubeChannel = Partial<CreateYoutubeChannel>;

// Public DTO
export type PublicYoutubeChannel = YoutubeChannelRow;