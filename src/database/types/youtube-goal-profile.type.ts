export interface YoutubeGoalProfileRow {
  id: number;

  name: string;

  goalViews: number;
  goalWatchHours: number;
  goalLikes: number;
  goalComments: number;

  createdAt: Date;
}

// Create DTO
export interface CreateYoutubeGoalProfile {
  name: string;
  goalViews?: number;
  goalWatchHours?: number;
  goalLikes?: number;
  goalComments?: number;
}

// Update DTO
export type UpdateYoutubeGoalProfile = Partial<CreateYoutubeGoalProfile>;

// Public DTO
export type PublicYoutubeGoalProfile = CreateYoutubeGoalProfile;