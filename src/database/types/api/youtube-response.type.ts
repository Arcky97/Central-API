export interface YoutubeVideoResponse {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  description: string;
  publishedAt: Date;
  playlistIds: string[];
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