import { SchemaColumn } from "../types/schema";

export function buildColumnType(column: SchemaColumn): string {
  let type = column.type.toUpperCase();

  if (column.unsigned) {
    type += " UNSIGNED";
  }

  return type.trim();
}