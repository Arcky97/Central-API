import { EmbedConfig } from "./embed-config.type";

export interface GeneratedEmbedsRow {
  id: string;
  guildId: string;
  channelId: string;
  messageId: string;
  config: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletionDate: Date | null;
}

// Create DTO
export interface CreateGeneratedEmbed {
  guildId: string;
  channelId: string;
  messageId: string;
  config: EmbedConfig;
  createdBy: string;
  deletionDate?: Date | null;
}

// Update DTO
export type UpdateGeneratedEmbed = Partial<CreateGeneratedEmbed>;

// Public DTO
export type PublicGeneratedEmbed = CreateGeneratedEmbed;