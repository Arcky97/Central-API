export interface YoutubeGoalProfileRow {
  id: number;
  channelId: number;

  name: string;

  views: number | null;
  watchHours: number | null;
  likes: number | null;
  comments: number | null;

  createdAt: Date;
}

// Create DTO
export interface CreateYoutubeGoalProfile {
  channelId: number;
  name: string;
  views?: number | null;
  watchHours?: number | null;
  likes?: number | null;
  comments?: number | null;
}

// Update DTO
export type UpdateYoutubeGoalProfile = Partial<CreateYoutubeGoalProfile>;

// Public DTO
export type PublicYoutubeGoalProfile = YoutubeGoalProfileRow;