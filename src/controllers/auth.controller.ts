import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { OAuthService } from "../services/oauth.service";
import { YoutubeOAuthMetadata, OAuthUser } from "../clients/oauth/oauth.type";

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

    res.json({
      success: true,
      user: authUser
    });
  }
}