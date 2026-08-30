export interface YoutubeVideoAnalytics {
  videoId: string;

  views: number;

  watchHours: number;

  averageViewDuration: number;
  averageViewPercentage: number;

  subscribersGained: number;
  subscribersLost: number;

  likes: number;
  comments: number;
  shares: number;
}

export interface YoutubeChannelAnalytics {
  date: string;
  views: number;
  watchHours: number;
  subscribersGained: number;
  subscribersLost: number;
}