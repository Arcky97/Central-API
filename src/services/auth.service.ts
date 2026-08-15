import { AuthUserRepository } from "../database/repositories/auth/AuthUserRepository";
import { DiscordAccountRepository } from "../database/repositories/auth/DiscordAccountRepository";
import { YoutubeAccountRepository } from "../database/repositories/auth/youtubeAccountRepository";
import { DiscordOAuthData, YoutubeOAuthData } from "../types/oauth.type";

const youtubeRepo = new YoutubeAccountRepository();
const discordRepo = new DiscordAccountRepository();
const authUserRepo = new AuthUserRepository();

export class AuthService {
  private static async createAuthUser(): Promise<number> {
    const result = await authUserRepo.create({});

    return result.insertId;
  }

  static async loginWithYoutube(data: YoutubeOAuthData) {
    const existingAccount =
      await youtubeRepo.getByGoogleUserId(data.googleUserId);

    if (existingAccount) {
      await youtubeRepo.updateWhere(
        {
          googleUserId: data.googleUserId
        },
        {
          channelId: data.channelId,
          channelName: data.channelName,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        }
      );

      return authUserRepo.findOne({
        id: existingAccount.authUserId
      });
    }

    const authUserId = await this.createAuthUser();

    await youtubeRepo.create({
      authUserId,
      googleUserId: data.googleUserId,
      channelId: data.channelId,
      channelName: data.channelName,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    });

    return authUserRepo.findOne({
      id: authUserId
    });
  }

  static async connectYoutube(
    authUserId: number,
    data: YoutubeOAuthData
  ) {
    const existingGoogleAccount =
      await youtubeRepo.getByGoogleUserId(data.googleUserId);

    if (existingGoogleAccount && existingGoogleAccount.authUserId !== authUserId) {
      throw new Error(
        "This Youtube account is already connected to another user."
      )
    }

    const existingUserAccount =
      await youtubeRepo.getByAuthUserId(authUserId);

    if (existingUserAccount) {
      await youtubeRepo.updateWhere(
        {
          authUserId
        },
        {
          googleUserId: data.googleUserId,
          channelId: data.channelId,
          channelName: data.channelName,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        }
      );

      return;
    }

    await youtubeRepo.create({
      authUserId,
      googleUserId: data.googleUserId,
      channelId: data.channelId,
      channelName: data.channelName,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    });
  }

  static async loginWithDiscord(data: DiscordOAuthData) {
    const existingAccount =
      await discordRepo.getByDiscordUserId(data.discordUserId);

    if (existingAccount) {
      await discordRepo.updateWhere(
        {
          discordUserId: data.discordUserId
        },
        {
          username: data.username,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        }
      );

      return authUserRepo.findOne({
        id: existingAccount.authUserId
      });
    }

    const authUserId = await this.createAuthUser();

    await discordRepo.create({
      authUserId,
      discordUserId: data.discordUserId,
      username: data.username,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    });

    return authUserRepo.findOne({
      id: authUserId
    });
  }

  static async connectDiscord(
    authUserId: number,
    data: DiscordOAuthData
  ) {
    const existingDiscordAccount =
      await discordRepo.getByDiscordUserId(data.discordUserId);

    if (existingDiscordAccount && existingDiscordAccount.authUserId !== authUserId) {
      throw new Error(
        "This Discord account is already connected to another user."
      )
    }

    const existingUserAccount =
      await discordRepo.getByAuthUserId(authUserId);

    if (existingUserAccount) {
      await discordRepo.updateWhere(
        {
          authUserId
        },
        {
          discordUserId: data.discordUserId,
          username: data.username,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        }
      );

      return;
    }

    await discordRepo.create({
      authUserId,
      discordUserId: data.discordUserId,
      username: data.username,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    });
  }
}