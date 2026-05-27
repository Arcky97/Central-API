import { query } from "../../query";
import { DatabaseName } from "../../types/schema";

export class Repository<DBRow, CreateInput = Partial<DBRow>, UpdateInput = Partial<DBRow>, PublicOutput = Partial<DBRow>> {
  tableName: string;
  db: DatabaseName;

  constructor(tableName: string, db: DatabaseName) {
    this.tableName = tableName;
    this.db = db;
  }

  async create(data: CreateInput) {
    return query(
      this.db,
      {
        sql: `INSERT INTO ${this.tableName} SET ?`
      },
      data
    );
  }

  async bulkCreate(rows: CreateInput[]) {
    await Promise.all(
      rows.map(row =>
        query(this.db, {
          sql: `INSERT INTO ${this.tableName} SET ?`
        }, row)
      )
    );
  }

  protected mapRow(row: DBRow): PublicOutput {
    return row as unknown as PublicOutput;
  }

  async getAll(): Promise<PublicOutput[]> {
    const result = await query<DBRow[]>(
      this.db, { 
        sql: 
          `SELECT * FROM ${this.tableName}` 
        }
    );

    return result.map(row => this.mapRow(row));
  }

  async getByGuildId(guildId: string): Promise<PublicOutput | null> {
    const result = await query<DBRow[]>(
      this.db,
      {
        sql: `SELECT * FROM ${this.tableName} WHERE guildId = ?`
      },
      [guildId]
    );

    const row = result[0];

    if (!row) return null;

    return this.mapRow(row);
  }

  async getOrCreateByGuildId(guildId: string, defaults: CreateInput) {
    await query(
      this.db,
      {
        sql: `
          INSERT INTO ${this.tableName}
          SET ?
          ON DUPLICATE KEY UPDATE guildId = guildId
        `
      },
      {
        guildId,
        ...defaults
      }
    );

    const result = await this.getByGuildId(guildId);
    return result!;
  }

  async findOne(where: Record<string, unknown>): Promise<PublicOutput | null> {
    const keys = Object.keys(where);

    const conditions = keys 
      .map(key => `${key} = ?`)
      .join(' AND ');

    const result = await query<DBRow[]>(
      this.db,
      {
        sql: `
          SELECT * FROM ${this.tableName}
          WHERE ${conditions}
        `
      }
    );

    const row = result[0];

    if (!row) return null;

    return this.mapRow(row);
  }

  async findMany(where: Record<string, unknown>, limit: number): Promise<PublicOutput[]> {
    const keys = Object.keys(where);

    const conditions = keys
      .map(key => `${key} = ?`)
      .join(' AND ');

    const result = await query<DBRow[]>(
      this.db,
      {
        sql: `
          SELECT * FROM ${this.tableName}
          WHERE ${conditions}
          LIMIT ?
        `
      },
      [String(limit)]
    );

    const rows = result;

    return rows.map(row => this.mapRow(row));
  }

  async updateWhere(where: Record<string, unknown>, data: UpdateInput) {
    const keys = Object.keys(where);

    const conditions = keys 
      .map(key => `${key} = ?`)
      .join(" AND ");

      const values = Object.values(where);

      await query(
        this.db,
        {
          sql: `
            UPDATE ${this.tableName}
            SET ?
            WHERE ${conditions}
          `
        },
        [data, ...values]
      )
  }
}