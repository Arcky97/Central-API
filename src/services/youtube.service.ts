import axios from "axios";
import { env } from "../config/env";

const BASE_URL = env.YOUTUBE_BASE_URL;

export class YouTubeService {
  constructor(
    private readonly apiKey: string,
    private readonly channelId: string
  ) {}

  async getChannelStats() {
    const { data } = await axios.get(
      `${BASE_URL}/channels`,
      {
        params: {
          part: "statistics,snippet",
          id: this.channelId,
          key: this.apiKey
        }
      }
    );

    return data.items[0]
  }
}