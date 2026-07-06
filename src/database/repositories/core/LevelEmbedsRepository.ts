import { CreateLevelEmbed, LevelEmbedsRow, PublicLevelEmbed, UpdateLevelEmbed } from "../../types/level-embeds.type";
import { Repository } from "../base/Repository";

export class LevelEmbedsRepository extends Repository <LevelEmbedsRow, CreateLevelEmbed, UpdateLevelEmbed, PublicLevelEmbed> {
  constructor() {
    super("levelEmbeds", "core");
  }
}