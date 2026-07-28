export interface YoutubeVideoAnalytics {
  youtubeVideoId: string;

  views: number;

  watchMinutes: number;
  watchHours: number;

  averageViewDuration: number;
  averageViewPercentage: number;

  subscribersGained: number;
  subscribersLost: number;

  likes: number;
  comments: number;
  shares: number;
}