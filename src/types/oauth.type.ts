export interface YoutubeOAuthData {
  googleUserId: string;
  channelId: string;
  channelName: string;
  accessToken: string;
  refreshToken?: string;
}

export interface DiscordOAuthData {
  discordUserId: string;
  username: string;
  accessToken: string;
  refreshToken: string;
}