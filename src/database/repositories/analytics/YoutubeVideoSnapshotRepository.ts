import { CreateYoutubeVideoSnapshot, PublicYoutubeVideoSnapshot, UpdateYoutubeVideoSnapshot, YoutubeVideoSnapshotRow } from "../../types/youtube-video-snapshot.type";
import { Repository } from "../base/Repository";

export class YoutubeVideoSnapshotRepository extends Repository<YoutubeVideoSnapshotRow, CreateYoutubeVideoSnapshot, UpdateYoutubeVideoSnapshot, PublicYoutubeVideoSnapshot> {
  constructor() {
    super("youtubeVideoSnapshots", "analytics");
  }

  
}