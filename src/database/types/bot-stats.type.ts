export interface BotStatsRow {
  guildId: string;
  totalCount: string;
  eventCount: string;
  commandCount: string;
  levelSystemCount: string;
}

// Create DTO
export interface CreateBotStats {
  guildId: string;

  totalCount: Record<string, string>[];
  eventCount: Record<string, string>[];
  commandCount: Record<string, string>[];
  levelSystemCount: Record<string, string>[];
}

// Update DTO
export type UpdateBotStats = Partial<CreateBotStats>;

// Public DTO
export type publicBotStats = CreateBotStats;