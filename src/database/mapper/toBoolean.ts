export function toBoolean(value: unknown): boolean {
  return value === 1 || value === true || value === "1";
}