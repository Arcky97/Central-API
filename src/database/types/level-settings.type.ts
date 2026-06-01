export interface LevelSettingsRow {
  guildId: string;

  deletionDate: Date | null;
}

// Create DTO
export interface CreateLevelSettings {
  guildId: string;

  deletionDate?: Date | null;
}

// Update DTO
export type UpdateLevelSettings = Partial<CreateLevelSettings>;

// Public DTO
export type PublicLevelSettings = CreateLevelSettings;