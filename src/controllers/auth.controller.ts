import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { OAuthService } from "../services/oauth.service";
import { YoutubeOAuthMetadata, DiscordOAuthMetadata, OAuthUser } from "../clients/oauth/oauth.type";
import { AuthRequest } from "../middleware/jwt";

export class AuthController {
  static async youtubeLogin(req: Request, res: Response) {
    const url = OAuthService.getAuthorizationUrl("youtube");

    res.json({ url });
  }

  static async youtubeCallback(req: Request, res: Response) {
    const code = req.query.code;

    if (typeof code !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing OAuth code."
      });
    }

    const { user, tokens } =
      await OAuthService.authenticate<YoutubeOAuthMetadata>(
        "youtube",
        code
      );

    const authUser = await AuthService.loginWithYoutube({
      googleUserId: user.providerUserId,
      channelId: user.metadata!.channelId,
      channelName: user.metadata!.channelName,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken ?? ""
    });

    if (!authUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to create or retrieve user"
      });
    }

    const token = AuthService.generateToken(authUser.id);

    res.json({
      success: true,
      token,
      user: authUser
    });
  }

/*
  static async discordLogin(req: Request, res: Response) {
    const url = OAuthService.getAuthorizationUrl("discord");

    res.json({ url });
  }

  static async discordCallback(req: Request, res: Response) {
    const code = req.query.code;

    if (typeof code !== "string") {
      return res.status(400).json({
        success: false,
        message: "Missing OAuth code."
      });
    }

    const { user, tokens } =
      await OAuthService.authenticate<DiscordOAuthMetadata>(
        "discord",
        code
      );

    const authUser = await AuthService.loginWithDiscord({
      discordUserId: user.providerUserId,
      username: user.metadata!.username,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken ?? ""
    });

    if (!authUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to create or retrieve user"
      });
    }

    const token = AuthService.generateToken(authUser.id);

    res.json({
      success: true,
      token,
      user: authUser
    });
  }
*/

  static async getProfile(req: AuthRequest, res: Response) {
    if (!req.authUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // You may want to fetch more detailed user info from database
    res.json({
      success: true,
      user: {
        id: req.authUserId
      }
    });
  }
}