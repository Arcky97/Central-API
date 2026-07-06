import { CreateUserStats, PublicUserStats, UpdateUserStats, UserStatsRow } from "../../types/user-stats.type";
import { Repository } from "../base/Repository";

export class UserStatsRepository extends Repository<UserStatsRow, CreateUserStats, UpdateUserStats, PublicUserStats> {
  constructor() {
    super("userStats", "core");
  }
}