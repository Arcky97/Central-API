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
  };
}