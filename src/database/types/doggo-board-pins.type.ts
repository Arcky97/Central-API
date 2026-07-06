export interface DoggoBoardPinsRow {
  guildId: string;
  messageId: string;
  pinMessageId: string;
  reactionAmount: number;
  deletionDate: Date | null;
}

// Create DTO 
export interface CreateDoggoBoardPin {
  guildId: string;
  messageId: string;
  pinMessageId: string;
  reactionAmount: number;

  DeletionDate?: Date | null;
}

// Update DTO 
export type UpdateDoggoBoardPin = Partial<CreateDoggoBoardPin>;

// Public DTO
export type PublicDoggoBoardPin = CreateDoggoBoardPin;