import { EmbedConfig } from "./embed-config.type";

export interface EventEmbedsRow {
  guildId: string;
  type: string;
  config: string;
  deletionDate: Date | null;
}

// Create DTO
export interface CreateEventEmbed {
  guildId: string;
  type: string;
  config: EmbedConfig;
  deletionDate?: Date | null;
}

// Update DTO
export type UpdateEventEmbed = Partial<CreateEventEmbed>;

// Public DTO
export type PublicEventEmbed = CreateEventEmbed;