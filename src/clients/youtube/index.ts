import { env } from "../../config/env";
import { YoutubeClient } from "./YoutubeClient";

export const youtubeClient = new YoutubeClient(
  env.YOUTUBE_API_KEY
);