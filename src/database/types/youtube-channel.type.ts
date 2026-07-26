export interface YoutubeChannelRow {
  id: number,

  channelId: string;
  channelName: string;

  createdAt: Date;
  updatedAt: Date;
}

// Create DTO
export interface CreateYoutubeChannel {
  channelId: string;
  channelName: string;
}

// Update DTO
export type UpdateYoutubeChannel = Partial<CreateYoutubeChannel>;

// Public DTO
export type PublicYoutubeChannel = YoutubeChannelRow;