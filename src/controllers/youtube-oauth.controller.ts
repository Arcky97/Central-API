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

    const { tokens } = await oauth2Client.getToken(code);

    console.log(tokens);

    res.send("OAuth completed. Check your server logs");
  }

  
}