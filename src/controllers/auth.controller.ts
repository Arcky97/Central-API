import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { OAuthService } from "../services/oauth.service";
import { YoutubeOAuthMetadata, DiscordOAuthMetadata, OAuthUser } from "../clients/oauth/oauth.type";
import { AuthRequest } from "../middleware/jwt";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { env } from "../config/env";
import { SyncJobsService } from "../services/sync-jobs.service";
import { youtubeSyncQueue } from "../queue/youtube-sync.queue";

const stateCookieName = "youtube_oauth_state";
const redirectCookieName = "youtube_oauth_redirect";
const sessionCookieName = "auth_session";
const allowedRedirects = new Set(["/"]);

function serializeCookie(name: string, value: string, maxAge?: number) {
  const attributes = ["Path=/", "HttpOnly", "SameSite=Lax"];

  if (env.NODE_ENV === "production") {
    attributes.push("Secure");
  }

  if (env.AUTH_COOKIE_DOMAIN) {
    attributes.push(`Domain=${env.AUTH_COOKIE_DOMAIN}`);
  }

  if (maxAge !== undefined) {
    attributes.push(`Max-Age=${maxAge}`);
  }

  return `${name}=${encodeURIComponent(value)}; ${attributes.join("; ")}`;
}

function getCookie(req: Request, name: string) {
  const cookie = req.headers.cookie
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : undefined;
}

export class AuthController {
  static async youtubeLogin(req: Request, res: Response) {
    const state = randomBytes(32).toString("hex");
    const redirect = typeof req.query.redirect === "string" && allowedRedirects.has(req.query.redirect)
      ? req.query.redirect
      : "/";
    const url = OAuthService.getAuthorizationUrl("youtube", state);

    res.setHeader("Set-Cookie", [
      serializeCookie(stateCookieName, state, 600),
      serializeCookie(redirectCookieName, redirect, 600)
    ]);
    res.json({ url });
  }

  static async youtubeCallback(req: Request, res: Response) {
    const code = req.query.code;
    const state = req.query.state;
    const storedState = getCookie(req, stateCookieName);
    const redirect = getCookie(req, redirectCookieName);
    const redirectPath = redirect && allowedRedirects.has(redirect) ? redirect : "/";

    if (typeof code !== "string" || typeof state !== "string" || !storedState) {
      return res.status(400).json({
        success: false,
        message: "Invalid OAuth callback."
      });
    }

    const expected = Buffer.from(storedState);
    const received = Buffer.from(state);

    if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OAuth state."
      });
    }

    res.setHeader("Set-Cookie", serializeCookie(stateCookieName, "", 0));

    const { user, tokens } =
      await OAuthService.authenticate<YoutubeOAuthMetadata>(
        "youtube",
        code
      );

    const youtubeAuthData = {
      googleUserId: user.providerUserId,
      channelId: user.metadata!.channelId,
      channelName: user.metadata!.channelName,
      accessToken: tokens.accessToken,
      ...(tokens.refreshToken ? { refreshToken: tokens.refreshToken } : {})
    };

    const authUser = await AuthService.loginWithYoutube(youtubeAuthData);

    if (!authUser.user) {
      return res.status(500).json({
        success: false,
        message: "Failed to create or retrieve user"
      });
    }

    if (authUser.isNewAccount) {
      const job = await SyncJobsService.createJob(
        authUser.user.id,
        "youtube_backfill",
        "Initial sync"
      );

      await youtubeSyncQueue.add("backfill", {
        jobId: job.id,
        authUserId: authUser.user.id,
        type: "backfill"
      });
    }

    const token = AuthService.generateToken(authUser.user.id);

    res.setHeader("Set-Cookie", [
      serializeCookie(stateCookieName, "", 0),
      serializeCookie(redirectCookieName, "", 0),
      serializeCookie(sessionCookieName, token)
    ]);
    res.redirect(`${env.FRONTEND_URL}${redirectPath}`);
  }

  static async logout(_req: Request, res: Response) {
    res.setHeader("Set-Cookie", serializeCookie(sessionCookieName, "", 0));
    res.json({ success: true });
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

    const youtubeAccount = await AuthService.getYoutubeAccount(req.authUserId);

    res.json({
      success: true,
      user: {
        id: req.authUserId,
        youtube: youtubeAccount
          ? {
              channelId: youtubeAccount.channelId,
              channelName: youtubeAccount.channelName
            }
          : null
      }
    });
  }
}