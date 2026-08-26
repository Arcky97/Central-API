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
  playlistIds: string[];
  views: number;
  likes: number;
  comments: number;
  shares: number;
  watchHours?: number;
  averageViewDuration?: number;
  averageViewPercentage?: number
  subscribersGained?: number;
  subscribersLost?: number;
}

export interface YoutubePlaylist {
  id: string;
  channelId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: Date;
  itemCount: number;
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
  averageViewDuration: number;
  averageViewPercentage: number;
}