import { CreateEventEmbed, EventEmbedsRow, PublicEventEmbed, UpdateEventEmbed } from "../../types/event-embeds.type";
import { Repository } from "../base/Repository";

export class EventEmbedsRepository extends Repository<EventEmbedsRow, CreateEventEmbed, UpdateEventEmbed, PublicEventEmbed>{
  constructor() {
    super("eventEmbeds", "core");
  }
}