export interface YoutubeVideoResponse {
  id: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
  statistics: {
    views: number;
    likes: number;
    comments: number;
  };
}