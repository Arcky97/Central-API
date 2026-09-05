import { progressMessages } from "../config/progressMessages";

export function getProgressMessage(progress: number): string {
  return [...progressMessages]
    .reverse()
    .find(({ value }) => progress >= value)?.message
    ?? "Getting things ready...";
}