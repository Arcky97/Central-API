export interface DiscordAccountRow {
  id: number;
  authUserId: number;
  discordUserId: string;
  username: string;
  accessToken: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create DTO
export type CreateDiscordAccount = Omit<DiscordAccountRow, "id" | "createdAt" | "updatedAt">;

// Update DTO
export type UpdateDiscordAccount = Partial<CreateDiscordAccount>;

// Public DTO
export type PublicDiscordAccount = Omit<DiscordAccountRow, "accessToken" | "refreshToken">;