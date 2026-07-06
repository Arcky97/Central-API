export interface EmbedConfig {
  channelId: string;
  message?: string;
  color?: string;
  author?: {
    name: string;
    url?: string;
    iconUrl?: string;
  };
  title: string;
  url?: string;
  description: string;
  fields?: {
    name: string;
    value: string;
  }[];
  imageUrl?: string;
  thumbnailUrl?: string;
  footer?: {
    name: string;
    iconUrl?: string;
  };
  timeStamp?: boolean;
}