import { CreateGeneratedEmbed, GeneratedEmbedsRow, PublicGeneratedEmbed, UpdateGeneratedEmbed } from "../../types/generated-embeds.type";
import { Repository } from "../base/Repository";

export class GeneratedEmbedsRepository extends Repository<GeneratedEmbedsRow, CreateGeneratedEmbed, UpdateGeneratedEmbed, PublicGeneratedEmbed>{
  constructor() {
    super("generatedEmbeds", "core");
  }
}