export interface LevelSettingsRow {
  guildId: string;
  config: string;
  deletionDate: Date | null;
}

// Create DTO
export interface CreateLevelSettings {
  guildId: string;
  config?: {
    levelRoles: {
      level: number;
      role: string;
    }[];
    multiplier: {
      global: number;
      categories: Record<string, number>[];
      channels: Record<string, number>[];
      roles: Record<string, number>[];
    };
    roleReplace: boolean;
    announcement: {
      channelId: string;
      pin: boolean;
    };
    blacklist: {
      categories: string[];
      channels: string[];
      roles: string[];
    };
    xp: {
      cooldown: number;
      settings: {
        step: number;
        min: number;
        max: number;
        minLength: number;
        maxLength: number;
      }
      type: "random" | "length";
    }
    clearOnLeave: boolean;
    voice: {
      enabled: boolean;
      multiplier: number;
      cooldown: number;
    }
  };
  deletionDate?: Date | null;
}

// Update DTO
export type UpdateLevelSettings = Partial<CreateLevelSettings>;

// Public DTO
export type PublicLevelSettings = CreateLevelSettings;