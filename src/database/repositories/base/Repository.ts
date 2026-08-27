import { ResultSetHeader } from "mysql2";
import { query } from "../../query";
import { DatabaseName, TableName } from "../../types/schema";

export class Repository<DBRow, CreateInput = Partial<DBRow>, UpdateInput = Partial<DBRow>, PublicOutput = Partial<DBRow>> {
  tableName: TableName;
  db: DatabaseName;

  constructor(tableName: TableName, db: DatabaseName) {
    this.tableName = tableName;
    this.db = db;
  }

  async create(data: CreateInput): Promise<ResultSetHeader> {
    if (Object.keys(data as object).length === 0) {
      return query(
        this.db,
        {
          sql: `INSERT INTO ${this.tableName} () VALUES ()`
        }
      );
    }

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

  /**
   * Scans an array of records for potential database issues:
   * - Missing / undefined fields
   * - NaN numeric values
   * - Invalid Date objects
   * Converts `undefined` and `NaN` to `null` to avoid SQL execution errors.
   */
  protected scanAndSanitizeRows<T extends Record<string, any>>(
    rows: T[],
    context: string = "bulkOperation"
  ): { sanitizedRows: T[]; columns: string[] } {
    if (rows.length === 0) {
      return { sanitizedRows: [], columns: [] };
    }

    // Collect all unique columns across all rows
    const columnSet = new Set<string>();
    for (const row of rows) {
      if (row && typeof row === "object") {
        for (const key of Object.keys(row)) {
          columnSet.add(key);
        }
      }
    }
    const columns = Array.from(columnSet);

    const sanitizedRows: T[] = [];
    const issues: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const originalRow = rows[i] as Record<string, any>;
      const sanitizedRow: Record<string, any> = {};

      for (const col of columns) {
        let val = originalRow[col];

        if (val === undefined) {
          issues.push(`Row index ${i}: column "${col}" is undefined (converted to NULL).`);
          val = null;
        } else if (typeof val === "number" && isNaN(val)) {
          issues.push(`Row index ${i}: column "${col}" is NaN (converted to NULL).`);
          val = null;
        } else if (val instanceof Date && isNaN(val.getTime())) {
          issues.push(`Row index ${i}: column "${col}" is an Invalid Date (converted to NULL).`);
          val = null;
        }

        sanitizedRow[col] = val;
      }

      sanitizedRows.push(sanitizedRow as T);
    }

    if (issues.length > 0) {
      console.warn(
        `[Repository:${this.tableName}] ${context} scan detected ${issues.length} issue(s) across ${rows.length} row(s):\n` +
        issues.slice(0, 10).map(issue => `  - ${issue}`).join("\n") +
        (issues.length > 10 ? `\n  ...and ${issues.length - 10} more issue(s)` : "")
      );
    }

    return { sanitizedRows, columns };
  }

  async bulkUpsert(
    rows: CreateInput[], 
    updateColumns: (keyof UpdateInput)[]
  ) {
    if (rows.length === 0) return;

    const { sanitizedRows, columns } = this.scanAndSanitizeRows(
      rows as Record<string, any>[],
      "bulkUpsert"
    );

    if (columns.length === 0) return;

    const placeholders = sanitizedRows
      .map(() =>
        `(${columns.map(() => "?").join(",")})`
      )
      .join(",");

    const values = sanitizedRows.flatMap(row =>
      columns.map(column => 
        (row as any)[column]
      )
    );

    const validUpdateColumns = updateColumns
      .map(column => String(column))
      .filter(column => columns.includes(column));

    const updates = validUpdateColumns.length > 0
      ? validUpdateColumns.map(column => `${column} = VALUES(${column})`).join(",")
      : `${columns[0]} = VALUES(${columns[0]})`;

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