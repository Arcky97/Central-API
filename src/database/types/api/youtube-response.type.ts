export interface YoutubeVideoResponse {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: Date;
  statistics: {
    views: number;
    likes: number;
    comments: number;
    watchHours: number;
    averageViewDuration: number;
    averageViewPercentage: number;
    subscribersGained: number;
    subscribersLost: number;
  };
}