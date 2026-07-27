export interface YoutubeVideoResponse {
  youtubeVideoId: string;
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