export interface YoutubeChannel {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  customUrl?: string;
  publishedAt: Date;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
}

export interface YoutubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: Date;
  channelId: string;
  channelTitle: string;
  views: number;
  likes: number;
  comments: number;
  watchHours?: number;
  avarageViewDuration?: number;
  impressions?: number;
  ctr?: number;
}

export interface YoutubeSyncResult {
  channel: YoutubeChannel;

  videos: YoutubeVideo[];
}

export interface YoutubePagedResult<T> {
  items: T[];
  nextPageToken?: string;
}


// later
export interface YoutubeComment {
  id: string;
  author: string;
  authorProfileImage: string;
  text: string;
  likeCount: string;
  publishedAt: Date;
  updatedAt: Date;
}

export interface YoutubeVideoAnalytics {
  videoId: string;
  watchHours: number;
  avarageViewDuration: number;
  impressions: number;
  ctr: number;
}