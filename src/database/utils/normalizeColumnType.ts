export function normalizeColumnType(type: string): string {
  return type
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
}