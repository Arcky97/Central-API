export interface LevelEmbedsRow {
  id: number;
  guildId: string;
  type: string;
  level: number;
  config: string;
  deletionDate: Date | null;
}

// Create DTO
export interface CreateLevelEmbed {
  guildId: string;
  type: string;
  level: number;
  config: {
    color: string ;
    title: string;
    description: string;
    imageUrl?: string | null;
    thumbnailUrl?: string | null;
    footer: {
      name?: string | null;
      iconUrl?: string | null;
    }
    timeStamp: boolean;
  };
  deletionDate?: Date | null;
}

// Update DTO
export type UpdateLevelEmbed = Partial<CreateLevelEmbed>;

// Public DTO 
export type PublicLevelEmbed = CreateLevelEmbed;