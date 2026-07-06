export interface ReactionRolesRow {
  guildId: string;
  channelId: string;
  messageId: string;
  emojiRolePairs: string;
  maxRoles: number;
  maxReactions: number;
  type: string;
  deletionDate: Date | null;
}

// Create DTO
export interface CreateReactionRole {
  guildId: string;
  channelId: string;
  messageId: string;
  emojiRolePairs: {
    emiji: string;
    role: string;
  }[];
  maxRoles: number;
  maxReactions: number;
  type: string;
  deletionDate?: Date | null;
};

// Update DTO
export type UpdateReactionRole = Partial<CreateReactionRole>;

// Public DTO 
export type PublicReactionRole = CreateReactionRole;