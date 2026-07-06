export interface GuildLoggingRow {
  guildId: string;
  config: string;
  deletionDate: Date | null;
}

// Create DTO
export interface CreateGuildLogging {
  guildId: string;
  config: {
    messages: {
      channelId: string;
      all: boolean;
      update: boolean;
      delete: boolean;
      bulk: boolean;
    };
    members: {
      channelId: string;
      roles: {
        all: boolean;
        add: boolean;
        remove: boolean;
      };
      name: {
        all: boolean;
        user: boolean;
        global: boolean;
        nick: boolean;
      };
      avatar: {
        all: boolean;
        global: boolean;
        server: boolean;
      };
      ban: {
        all: boolean;
        add: boolean;
        remove: boolean;
      };
      timeout: {
        all: boolean;
        add: boolean;
        remove: boolean;
      };
    };
    server: {
      channelId: string;
      channels: {
        all: boolean;
        create: boolean;
        update: boolean;
        delete: boolean;
      };
      roles: {
        all: boolean;
        create: boolean;
        update: boolean;
        delete: boolean;
      };
      updates: {
        all: boolean;
      };
      emojis: {
        all: boolean;
        create: boolean;
        update: boolean;
        delete: boolean;
      };
      stickers: {
        all: boolean;
        create: boolean;
        update: boolean;
        delete: boolean;
      };
    };
    voice: {
      channelId: string;
      all: boolean;
      join: boolean;
      move: boolean;
      leave: boolean;
      mute: boolean;
      unmute: boolean;
      deafen: boolean;
      undeafen: boolean;
    };
    joinleave: {
      all: boolean;
      join: boolean;
      leave: boolean;
    };
    moderation: {
      channelId: string;
      warn: {
        all: boolean;
        add: boolean;
        removes: boolean;
        clears: boolean;
      };
      mutes: boolean;
      unmute: boolean;
      timeouts: {
        all: boolean;
        add: boolean;
        remove: boolean;
      };
      kick: boolean;
      ban: {
        all: boolean;
        regular: boolean;
        soft: boolean;
        temp: boolean;
      };
      unban: boolean;
    }
  }
  deletionDate?: Date | null;
}

// Update DTO
export type UpdateGuildLogging = Partial<CreateGuildLogging>;

// Public DTO
export type PublicGuildLogging = CreateGuildLogging;