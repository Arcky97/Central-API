import type { RowDataPacket } from "mysql2";

import { query } from "../query";
import type { TableSchema } from "../types/schema";

import { logInfo, logSuccess } from "./logger";

interface IndexRow extends RowDataPacket {
  Key_name: string;
}

export async function syncIndexes(
  schema: TableSchema
) {
  if (!schema.indexes?.length) return;

  const indexes = await query<IndexRow[]>(
    schema.database,
    { 
      sql: `SHOW INDEX FROM \`${schema.table}\`` 
    }
  );

  const existingIndexes = new Set(
    indexes.map(index => index.Key_name)
  );

  for (const index of schema.indexes) {
    if (existingIndexes.has(index.name)) continue;

    logInfo(
      `Creating index ${index.name}`
    );

    const unique = index.unique
      ? "UNIQUE"
      : "";

    const columns = index.columns
      .map(column => `\`${column}\``)
      .join(", ");

    await query(
      schema.database,
      { 
        sql: `
          CREATE ${unique} INDEX \`${index.name}\`
          ON \`${schema.table}\` (${columns})
        `
      }
    );

    logSuccess(
      `Created index ${index.name}`
    );
  }
}