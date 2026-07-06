export interface BotRepliesRow {
  uuid: string;
  trigger: string;
  responses: string;
  createdAt: Date;
  updateAt: Date;
}

// Create DTO
export interface CreateBotReplies {
  uuid: string;
  trigger: string;
  responses: Record<string, string | string[]>[];
}

// Update DTO 
export type UpdateBotReplies = Partial<CreateBotReplies>;

// Public DTO
export type PublicBotReplies = CreateBotReplies;