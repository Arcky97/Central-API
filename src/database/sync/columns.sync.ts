import type { RowDataPacket } from "mysql2";

import { query } from "../query";
import type { TableSchema } from "../types/schema";

import { 
  logInfo,
  logSuccess,
  logWarning
} from "./logger";

interface ColumnRow extends RowDataPacket {
  COLUMN_NAME: string;
  COLUMN_TYPE: string;
  IS_NULLABLE: "YES" | "NO";
  COLUMN_DEFAULT: string | null;
}

export async function syncColumns(
  schema: TableSchema
) {
  const columns = await query<ColumnRow[]>(
    schema.database,
    `
    SELECT
      COLUMN_NAME,
      COLUMN_TYPE,
      IS_NULLABLE,
      COLUMN_DEFAULT
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
     AND table_name = ?
    `,
    [schema.table]
  );

  const existingcolumns = new Map(
    columns.map(column => [
      column.COLUMN_NAME,
      column
    ])
  );

  for (const [name, definition] of Object.entries(
    schema.columns
  )) {
    const existing = existingcolumns.get(name);

    if (!existing) {
      logInfo(
        `Adding missing column ${name}`
      );

      let sql = `
        ALTER TABLE \`${schema.table}\`
        ADD COLUMN \`${name}\` ${definition.type}
      `;

      if (definition.nullable === false) {
        sql += " NOT NULL";
      }

      if (definition.default !== undefined) {
        sql += ` DEFAULT ${definition.default}`;
      }

      await query(schema.database, sql);

      logSuccess(
        `Added column ${name}`
      );

      continue;
    }

    const actualType = existing.COLUMN_TYPE.toUpperCase();
    const expectedType = definition.type.toUpperCase();

    if (actualType !== expectedType) {
      logWarning(
        `${schema.table}.${name} type mismatch (${actualType} vs ${expectedType})`
      );
    }
  }
}