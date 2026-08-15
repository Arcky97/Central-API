export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string | undefined;
  expiresAt?: Date | undefined;
}

export interface OAuthUser<TMetadata = Record<string, unknown>> {
  providerUserId: string;
  username?: string | undefined;
  displayName?: string | undefined;

  metadata?: TMetadata;
}

export interface OAuthClient<TMetadata = Record<string, unknown>> {
  getAuthorizationUrl(state?: string): string;

  exchangeCode(code: string): Promise<OAuthTokens>;

  getUser(tokens: OAuthTokens): Promise<OAuthUser<TMetadata>>;
}

export type OAuthProvider = "youtube";

export interface YoutubeOAuthMetadata {
  googleUserId: string;
  channelId: string;
  channelName: string;
}