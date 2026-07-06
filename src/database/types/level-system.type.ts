export interface LevelSystemRow {
  guildId: string;
  memberId: string;
  level: number;
  xp: number;
  oldXp: number;
  color: string;
  deletionDate: Date | null;
}

// Create DTO
export interface CreateLevelSystem {
  guildId: string;
  memberId: string;
  level: number;
  xp: number;
  oldXp: number;
  color: string;
  deletionDate?: Date | null;
}

// Update DTO
export type UpdateLevelSystem = Partial<CreateLevelSystem>;

// Public DTO
export type PublicLevelSystem = CreateLevelSystem;