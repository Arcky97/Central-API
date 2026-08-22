export interface YoutubeGoalProfileRow {
  id: number;
  channelId: number;

  name: string;

  goalViews: number | null;
  goalWatchHours: number | null;
  goalLikes: number | null;
  goalComments: number | null;

  createdAt: Date;
}

// Create DTO
export interface CreateYoutubeGoalProfile {
  channelId: number;
  name: string;
  goalViews?: number | null;
  goalWatchHours?: number | null;
  goalLikes?: number | null;
  goalComments?: number | null;
}

// Update DTO
export type UpdateYoutubeGoalProfile = Partial<CreateYoutubeGoalProfile>;

// Public DTO
export type PublicYoutubeGoalProfile = YoutubeGoalProfileRow;