import { google } from "googleapis";
import { env } from "../../config/env";
import {
  OAuthClient,
  OAuthTokens,
  OAuthUser,
  YoutubeOAuthMetadata
} from "./oauth.type";

export class YoutubeOAuthClient implements OAuthClient<YoutubeOAuthMetadata> {
  private oauth2 = new google.auth.OAuth2(
    env.YOUTUBE_CLIENT_ID,
    env.YOUTUBE_CLIENT_SECRET,
    env.YOUTUBE_REDIRECT_URI
  );

  getAuthorizationUrl(state?: string): string {
    return this.oauth2.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/youtube.readonly",
        "https://www.googleapis.com/auth/yt-analytics.readonly"
      ],
      ...(state !== undefined ? { state } : {})
    });
  }

  async exchangeCode(code: string): Promise<OAuthTokens> {
    const { tokens } = await this.oauth2.getToken(code);

    if (!tokens.access_token) {
      throw new Error("YouTube OAuth did not return an access token.");
    }

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token ?? undefined,
      expiresAt: tokens.expiry_date
        ? new Date(tokens.expiry_date)
        : undefined
    };
  }

  async getUser(tokens: OAuthTokens): Promise<OAuthUser<YoutubeOAuthMetadata>> {
    this.oauth2.setCredentials({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken ?? null
    });

    const oauth2 = google.oauth2({
      version: "v2",
      auth: this.oauth2
    });

    const userResponse = await oauth2.userinfo.get();

    const googleUserId = userResponse.data.id;

    if (!googleUserId) {
      throw new Error(
        "No Google user ID was returned for this account."
      );
    }

    const youtube = google.youtube({
      version: "v3",
      auth: this.oauth2
    });

    const response = await youtube.channels.list({
      part: ["id", "snippet"],
      mine: true
    });

    const channel = response.data.items?.[0];

    if (!channel?.id) {
      throw new Error(
        "No YouTube channel was found for this account."
      );
    }

    return {
      providerUserId: googleUserId,
      username: channel.snippet?.customUrl ?? undefined,
      displayName: channel.snippet?.title ?? undefined
    };
  }
}