
export function normalizeColumnType(type: string): string {
  return type
    .toUpperCase()

    .replace(/\(\d+\)/g, "")

    .replace(/\s+/g, " ")

    .trim();
}