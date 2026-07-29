export function removeUndefined<T extends Record<string, unknown>>(
  obj: T
): {
  [K in keyof T as undefined extends T[K] ? K : K]:
    Exclude<T[K], undefined>;
} {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as any;
}