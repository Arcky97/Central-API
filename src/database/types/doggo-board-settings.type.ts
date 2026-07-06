export interface DoggoBoardSettingsRow {
  guildId: string;
  config: string;
  deletionDate: Date | null;
}

// Create DTO
export interface CreateDoggoBoardSettings {
  guildId: string;
  config: {
    pinChannel: string;
    emojiId: string[];
    requiredRections: number;
    messageAgeHour: number;
    pinAgeDay: number;
    updateTimeMin: number;
    reactionSettings: "and" | "or" | "sum"
  }
  deletionDate?: Date | null;
}

// Update DTO
export type UpdateDoggoBoardSettings = Partial<CreateDoggoBoardSettings>;

// Public DTO
export type PublicDoggoBoardSettings = CreateDoggoBoardSettings;