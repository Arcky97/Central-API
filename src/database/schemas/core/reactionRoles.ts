import { TableSchema } from "../../types/schema";

export const reactionRolesSchema: TableSchema = {
  version: 1,
  strict: true,
  database: "core",
  table: "reactionRoles",
  columns: {
    guildId: {
      type: "VARCHAR(20)",
      nullable: false,
      primaryKey: true 
    },
    channelId: {
      type: "VARCHAR(20)",
      nullable: false,
      primaryKey: true
    },
    memberId: {
      type: "VARCHAR(20)",
      nullable: false,
      primaryKey: true
    },
    emojiRolePairs: {
      type: "LONGTEXT",
      default: "NULL"
    },
    maxRoles: {
      type: "INT(3)",
      unsigned: true,
      default: "0"
    },
    maxReactions: {
      type: "INT(3)", 
      unsigned: true,
      default: "0"
    },
    type: {
      type: "VARCHAR(128)",
      default: "NULL"
    },
    deletionDate: {
      type: "TIMESTAMP"
    }
  },
  indexes: [
    {
      name: "idx_deletionDate",
      columns: ["deletionDate"]
    }
  ]
}