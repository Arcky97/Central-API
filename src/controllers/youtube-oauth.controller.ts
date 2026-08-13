import { Request, Response } from "express";
import { oauth2Client } from "../clients/youtube/oauth";

export class YoutubeOAuthController {
  static async getAuthUrl(req: Request, res: Response) {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/yt-analytics.readonly",
        "https://www.googleapis.com/auth/youtube.readonly"
      ]
    });

    res.json({ url });
  }

  static async callback(req: Request, res: Response) {
    const code = req.query.code as string;

    if (!code) {
      return res.status(400).send("Missing OAuth code.");
    }

    const { tokens } = await oauth2Client.getToken(code);

    console.log("[YouTube OAuth] Tokens received:");
    console.log({
      ...tokens,
      access_token: tokens.access_token ? "[REDACTED]" : undefined,
      refresh_token: tokens.refresh_token 
        ? `${tokens.refresh_token.slice(0, 10)}...`
        : undefined
    });

    res.send("OAuth completed. Check your server logs");
  }
}