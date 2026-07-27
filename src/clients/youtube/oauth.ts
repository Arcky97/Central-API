import { google } from "googleapis";
import { env } from "../../config/env";

export const oauth2Client = new google.auth.OAuth2(
  env.YOUTUBE_CLIENT_ID,
  env.YOUTUBE_CLIENT_SECRET,
  env.YOUTUBE_REDIRECT_URI
);