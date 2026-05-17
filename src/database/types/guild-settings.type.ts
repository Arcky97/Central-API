export interface GuildSettingsRow {
  guildId: string;

  logging: number;
  leveling: number;
  doggoBoard: number;
  reactionRoles: number;

  deletionDate: Date | null;
}

export interface GuildSettings {
  guildId: string;

  logging: boolean;
  leveling: boolean;
  doggoBoard: boolean;
  reactionRoles: boolean;

  deletionDate: Date | null;
}