export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string | undefined;
  expiresAt?: Date | undefined;
}

export interface OAuthUser<TMetadata  = unknown> {
  providerUserId: string;
  username?: string | undefined;
  displayName?: string | undefined;

  metadata?: TMetadata;
}

export interface OAuthClient<TMetadata = unknown> {
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

/**
 * Maps each OAuth provider to its corresponding metadata type.
 * Use this to ensure type safety across the OAuth client registry.
 */
export interface OAuthMetadataMap {
  youtube: YoutubeOAuthMetadata;
  // discord: DiscordOAuthMetadata; // Add when implementing Discord OAuth
}