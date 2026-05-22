import type { RowDataPacket } from "mysql2";
import { query } from "../query";
import type { TableSchema } from "../types/schema";
import { logInfo, logSuccess, logWarning } from "./logger";
import { normalizeColumnType } from "../utils/normalizeColumnType";
import { buildColumnType } from "../utils/buildColumnType";

interface ColumnRow extends RowDataPacket {
  COLUMN_NAME: string;
  COLUMN_TYPE: string;
  IS_NULLABLE: "YES" | "NO";
  COLUMN_DEFAULT: string | null;
}

function getBaseType(type: string): string {
  return type
    .toLowerCase()
    .match(/^[a-z]+/i)?.[0] ?? type.toLowerCase();
}

export async function syncColumns(schema: TableSchema) {
  logInfo(`Starting column sync for ${schema.database}.${schema.table}`);

  const columns = await query<ColumnRow[]>(
    schema.database,
    {
      sql: `
        SELECT
          COLUMN_NAME,
          COLUMN_TYPE,
          IS_NULLABLE,
          COLUMN_DEFAULT
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
        AND table_name = ?
      `
    },
    [schema.table]
  );

  const existingColumns = new Map(
    columns.map(col => [col.COLUMN_NAME, col])
  );

  for (const [name, definition] of Object.entries(schema.columns)) {
    const existing = existingColumns.get(name);

    if (!existing) {
      logInfo(`[ADD] Missing column detected: ${name}`);

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

      await query(schema.database, { sql });

      logSuccess(`[ADD] Column created: ${name}`);
      continue;
    }

    const actualTypeRaw = existing.COLUMN_TYPE;
    const expectedTypeRaw = buildColumnType(definition);

    const actualType = normalizeColumnType(actualTypeRaw);
    const expectedType = normalizeColumnType(expectedTypeRaw);

    const actualBase = getBaseType(actualTypeRaw);
    const expectedBase = getBaseType(expectedTypeRaw);

    if (actualType === expectedType) {
      logInfo(`[OK] ${schema.table}.${name} already in sync`);
      continue;
    }

    if (actualBase !== expectedBase) {
      logWarning(
        `[BLOCKED] ${schema.table}.${name} incompatible type change`
      );

      logWarning(
        `         ${actualTypeRaw} → ${expectedTypeRaw}`
      );

      continue;
    }

    logInfo(
      `[UPDATE] ${schema.table}.${name}`
    );

    logInfo(
      `         ${actualTypeRaw} → ${expectedTypeRaw}`
    );

    const sql = `
      ALTER TABLE \`${schema.table}\`
      MODIFY COLUMN \`${name}\` ${expectedTypeRaw}
    `;

    await query(schema.database, { sql });

    logSuccess(
      `[UPDATED] ${schema.table}.${name} successfully altered`
    );
  }

  logInfo(`Column sync completed for ${schema.table}`);
}