import { env } from "../../config/env";
import { YoutubeAnalyticsClient } from "./YoutubeAnalyticsClient";
import { YoutubeClient } from "./YoutubeClient";

export const youtubeClient = new YoutubeClient(
  env.YOUTUBE_API_KEY
);

export const youtubeAnalyticsClient = new YoutubeAnalyticsClient();