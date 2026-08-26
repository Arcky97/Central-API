import { CreateYoutubePlaylist, PublicYoutubePlaylist, UpdateYoutubePlaylist, YoutubePlaylistRow } from "../../types/youtube-playlist.type";
import { Repository } from "../base/Repository";

export class YoutubePlaylistRepository extends Repository<YoutubePlaylistRow, CreateYoutubePlaylist, UpdateYoutubePlaylist, PublicYoutubePlaylist> {
  constructor() {
    super("youtubePlaylists", "analytics");
  }

  async getByPlaylistId(playlistId: string) {
    return this.findOne({
      playlistId
    });
  }

  async getByChannelId(channelId: number) {
    return this.findMany({ channelId });
  }

  async getLookupMap(channelId: number) {
    const playlists = await this.getByChannelId(channelId);

    return new Map(
      playlists.map(playlist => [
        playlist.playlistId,
        playlist
      ])
    );
  }
}
