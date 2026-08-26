export interface YoutubePlaylistRow {
  id: number;

  channelId: number;
  playlistId: string;

  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  itemCount: number | null;

  publishedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

// Create DTO
export interface CreateYoutubePlaylist {
  channelId: number;
  playlistId: string;

  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  itemCount?: number | null;

  publishedAt?: Date | null;
}

// Update DTO
export type UpdateYoutubePlaylist = Partial<CreateYoutubePlaylist>;

// Public DTO
export type PublicYoutubePlaylist = YoutubePlaylistRow;
