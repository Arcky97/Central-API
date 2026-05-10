import { logError, logWarning } from "../sync/logger";
import type { TableSchema } from "../types/schema";

const INTEGER_TYPES = /\b(INT|BIGINT|SMALLINT|TINYINT|MEDIUMINT)\b/i;

const DATE_UPDATE_TYPES = /\b(TIMESTAMP|DATETIME)\b/i;

const RAW_DEFAULT_VALUES = [
  "NULL",
  "CURRENT_TIMESTAMP"
];

function formatDefaultValues(value: unknown): string {
  if (typeof value === "string") {
    if (RAW_DEFAULT_VALUES.includes(value.toUpperCase())) {
      return value;
    }

    return `'${value.replace(/'/g, "''")}'`;
  }

  if (typeof value === "boolean") {
    return value ? "1" : "0";
  }

  return String(value);
}

export function buildCreateTableSQL(
  schema: TableSchema
): string {
  const columnDefinitions: string[] = [];

  const primaryKeys: string[] = [];
  const uniqueKeys: string[] = [];

  const autoIncrementColumns: string[] = [];

  for (const [name, column] of Object.entries(schema.columns)) {
    let valid = true;

    let definition = `\`${name}\` ${column.type}`;

    /**
     * UNSIGNED
     */
    if (column.unsigned) {
      if (!INTEGER_TYPES.test(column.type)) {
        logError(
          `${name}: ${column.type} cannot be UNSIGNED.`
        );
        valid = false;
      } else {
        definition += " UNSIGNED";
      }
    }

    /**
     * NULL / NOT NULL
     */

    if (column.nullable === false) {
      definition += " NOT NULL";
    }

    /**
     * AUTO_INCREMENT 
     */

    if (column.autoIncrement) {
      autoIncrementColumns.push(name);

      if (!INTEGER_TYPES.test(column.type)) {
        logError(
          `${name}: AUTO_INCREMENT requires integer type.`
        );
        valid = false;
      }

      if (column.nullable === true) {
        logError(
          `${name}: AUTO_INCREMENT columns cannot be nullable.`
        );
        valid = false;
      }

      if (!column.primaryKey && !column.unique) {
        logWarning(
          `${name}: AUTO_INCREMENT columns should usually be PRIMARY KEY or UNIQUE.`
        );
      }

      if (valid) {
        definition += " AUTO_INCREMENT";
      }
    }

    /**
     * DEFAULT 
     */
    if (column.default !== undefined) {
      if (
        column.nullable === false && 
        column.default === "NULL"
      ) {
        logError(
          `${name}: NOT NULL column cannot DEFAULT NULL.`
        );

        valid = false;
      } else {
        definition += ` DEFAULT ${formatDefaultValues(column.default)}`;
      }
    }

    /**
     * ON UPDATE
     */

    if (column.onUpdate) {
      if (!DATE_UPDATE_TYPES.test(column.type)) {
        logWarning(
          `${name}: ON UPDATE is usually only valid for TIMESTAMP/DATETIME.`
        );

        valid = false;
      } else {
        definition += ` ON UPDATE ${column.onUpdate}`;
      }
    }

    /**
     * PRIMARY KEY
     */
    if (column.primaryKey) {
      if (column.nullable === true) {
        logWarning(
          `${name}: PRIMARY KEY columns cannot be nullable.`
        );

        valid = false;
      } 
      
      primaryKeys.push(name);
    }

    /**
     * UNIQUE
     */
    if (column.unique) {
      if (column.primaryKey) {
        logWarning(
          `${name}: PRIMARY KEY columns are already UNIQUE.`
        );
      }

      uniqueKeys.push(name);
    }

    /**
     * Skip invalid definitions
     */
    if (!valid) {
      logError(
        `${name}: Column definition skipped due to invalid configuration.`
      );

      continue;
    }

    columnDefinitions.push(definition);
  }

  /**
   * Validate AUTO_INCREMENT placement
   */
  if (autoIncrementColumns.length > 1) {
    logError(
      `${schema.table}: Only one AUTO_INCREMENT column is allowed.`
    );
  }

  if (primaryKeys.length > 0) {
    const firstPrimaryKey = primaryKeys[0];

    for (const autoColumn of autoIncrementColumns) {
      if (autoColumn !== firstPrimaryKey) {
        logWarning(
          `${autoColumn}: AUTO_INCREMENT columns should be the first column in a PRIMARY KEY.`
        );
      }
    }

    columnDefinitions.push(
      `PRIMARY KEY (${primaryKeys
        .map(key => `\`${key}\``)
        .join(", ")})`
    );
  }

  /**
   * UNIQUE KEYS
   */
  for (const key of uniqueKeys) {
    if (primaryKeys.includes(key)) {
      continue;
    }

    columnDefinitions.push(
      `UNIQUE KEY\`uniq_${key}\` (\`${key}\`)`
    );
  }

  return `
    CREATE TABLE IF NOT EXISTS \`${schema.table}\` (
      ${columnDefinitions.join(",\n      ")}
    )
    ENGINE=InnoDB
    DEFAULT CHARSET=utf8mb4;
  `;
}