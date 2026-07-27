import { query } from "../../query";
import { DatabaseName, TableName } from "../../types/schema";

export class Repository<DBRow, CreateInput = Partial<DBRow>, UpdateInput = Partial<DBRow>, PublicOutput = Partial<DBRow>> {
  tableName: TableName;
  db: DatabaseName;

  constructor(tableName: TableName, db: DatabaseName) {
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

  async bulkUpdate(
    rows: {
      where: Record<string, unknown>;
      data: UpdateInput;
    }[]
  ) {
    await Promise.all(
      rows.map(row => 
        this.updateWhere(row.where, row.data)
      )
    );
  }

  protected mapRow(row: DBRow): PublicOutput {
    return row as unknown as PublicOutput;
  }

  async bulkUpsert(
    rows: CreateInput[], 
    updateColumns: (keyof UpdateInput)[]
  ) {
    if (rows.length === 0) return;

    const columns = Object.keys(rows[0] as object);

    const placeholders = rows
      .map(() =>
        `(${columns.map(() => "?").join(",")})`
      )
      .join(",");

    const values = rows.flatMap(row =>
      columns.map(column => 
        (row as any)[column]
      )
    );

    const updates = updateColumns
      .map(column =>
        `${String(column)} = VALUES(${String(column)})`
      )
      .join(",");

    await query(
      this.db,
      {
        sql: `
          INSERT INTO ${this.tableName}
          (${columns.join(",")})

          VALUES ${placeholders}

          ON DUPLICATE KEY UPDATE 
          ${updates}
        `
      },
      values
    );
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

  async findOne(): Promise<PublicOutput | null>;
  async findOne(where: Record<string, unknown>): Promise<PublicOutput | null>;
  async findOne(where: Record<string, unknown> = {}): Promise<PublicOutput | null> {
    const keys = Object.keys(where);

    let sql = `SELECT * FROM ${this.tableName}`;
    const values: unknown[] = [];

    if (keys.length > 0) {
      const conditions = keys
        .map(key => `${key} = ?`)
        .join(" AND ");

      sql += ` WHERE ${conditions}`;
      values.push(...Object.values(where));
    }

    sql += ` LIMIT 1`;

    const result = await query<DBRow[]>(
      this.db,
      {
        sql
      },
      values
    );

    const row = result[0];

    if (!row) return null;

    return this.mapRow(row);
  }

  async findMany(where: Record<string, unknown> = {}, limit?: number): Promise<PublicOutput[]> {
    const keys = Object.keys(where);

    let sql = `SELECT * FROM  ${this.tableName}`;
    const values: unknown[] = [];

    if (keys.length > 0) {
      const conditions = keys 
        .map(key => `${key} = ?`)
        .join(" AND ");

      sql += ` WHERE ${conditions}`;
      values.push(...Object.values(where));
    }

    if (limit) {
      sql += ` LIMIT ?`;
      values.push(limit);
    }

    const result = await query<DBRow[]>(
      this.db,
      { sql },
      values
    );

    return result.map(row => this.mapRow(row));
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

  async deleteWhere(where: Record<string, unknown>) {
    const keys = Object.keys(where);

    const conditions = keys 
      .map(key => `${key} = ?`)
      .join(" AND ");

    const values = Object.values(where);

    await query(
      this.db,
      {
        sql: `
          DELETE FROM ${this.tableName}
          WHERE ${conditions}
        `
      },
      values
    );
  }
}