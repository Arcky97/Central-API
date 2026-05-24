export interface GuildSettingsRow {
  guildId: string;

  logging: number;
  leveling: number;
  doggoBoard: number;
  reactionRoles: number;

  deletionDate: Date | null;
}

// Create DTO
export interface CreateGuildSettings {
  guildId: string;

  logging: boolean;
  leveling: boolean;
  doggoBoard: boolean;
  reactionRoles: boolean;

  deletionDate: Date | null;
}

// Update DTO
export type UpdateGuildSettings = Partial<CreateGuildSettings>;

// Public DTO
export type PublicGuildSettings = CreateGuildSettings;