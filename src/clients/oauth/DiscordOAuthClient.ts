/*import axios from "axios";
import { env } from "../../config/env";
import {
  OAuthClient,
  OAuthTokens,
  OAuthUser,
  DiscordOAuthMetadata
} from "./oauth.type";

interface DiscordTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

interface DiscordUserResponse {
  id: string;
  username: string;
  global_name: string;
  avatar?: string;
  discriminator: string;
}

export class DiscordOAuthClient implements OAuthClient<DiscordOAuthMetadata> {
  private readonly DISCORD_API_BASE = "https://discord.com/api/v10";
  private readonly DISCORD_OAUTH_URL = "https://discord.com/api/oauth2/authorize";
  private readonly DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token";
  private readonly DISCORD_USER_URL = `${this.DISCORD_API_BASE}/users/@me`;

  getAuthorizationUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: env.DISCORD_CLIENT_ID,
      redirect_uri: env.DISCORD_REDIRECT_URI,
      response_type: "code",
      scope: "identify",
      ...(state !== undefined ? { state } : {})
    });

    return `${this.DISCORD_OAUTH_URL}?${params.toString()}`;
  }

  async exchangeCode(code: string): Promise<OAuthTokens> {
    try {
      const response = await axios.post<DiscordTokenResponse>(
        this.DISCORD_TOKEN_URL,
        {
          client_id: env.DISCORD_CLIENT_ID,
          client_secret: env.DISCORD_CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
          redirect_uri: env.DISCORD_REDIRECT_URI
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresAt: new Date(Date.now() + response.data.expires_in * 1000)
      };
    } catch (error) {
      throw new Error(
        `Failed to exchange Discord OAuth code: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  async getUser(tokens: OAuthTokens): Promise<OAuthUser<DiscordOAuthMetadata>> {
    try {
      const response = await axios.get<DiscordUserResponse>(
        this.DISCORD_USER_URL,
        {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`
          }
        }
      );

      const user = response.data;

      return {
        providerUserId: user.id,
        username: user.username,
        displayName: user.global_name ?? user.username,
        metadata: {
          discordUserId: user.id,
          username: user.username,
          displayName: user.global_name ?? user.username
        }
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch Discord user info: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }
}
*/