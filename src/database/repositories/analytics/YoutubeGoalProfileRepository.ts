import { CreateYoutubeGoalProfile, PublicYoutubeGoalProfile, UpdateYoutubeGoalProfile, YoutubeGoalProfileRow } from "../../types/youtube-goal-profile.type";
import { Repository } from "../base/Repository";

export class YoutubeGoalProfileRepository extends Repository<YoutubeGoalProfileRow, CreateYoutubeGoalProfile, UpdateYoutubeGoalProfile, PublicYoutubeGoalProfile> {
  constructor() {
    super("youtubeGoalProfiles", "analytics");
  }
}