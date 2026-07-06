import { CreateLevelSystem, LevelSystemRow, PublicLevelSystem, UpdateLevelSystem } from "../../types/level-system.type";
import { Repository } from "../base/Repository";

export class LevelSystemRepository extends Repository<LevelSystemRow, CreateLevelSystem, UpdateLevelSystem, PublicLevelSystem> {
  constructor() {
    super("levelSystem", "core");
  }
}