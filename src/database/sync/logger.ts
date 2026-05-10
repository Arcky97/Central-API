export function logSection(title: string) {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(title);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

export function logInfo(message: string) {
  console.log(`[INFO] ${message}`);
}

export function logSuccess(message: string) {
  console.log(`[SUCCESS] ${message}`);
}

export function logWarning(message: string) {
  console.log(`[WARNING] ${message}`);
}

export function logError(message: string) {
  console.log(`[ERROR] ${message}`);
}