export interface UserStatsRow {
  guildId: string;
  memberId: string;
  attempts: string;
  commands: string;
};

// Create DTO
export interface CreateUserStats {
  guildId: string;
  memberId: string;
  attempts: Record<string, number | Record<string, number | string> | string>;
  commands: Record<string, number | Record<string, number | string> | string>;
};

// Update DTO 
export type UpdateUserStats = Partial<CreateUserStats>;

// Public DTO
export type PublicUserStats = CreateUserStats;