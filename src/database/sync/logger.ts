export function logSection(title: string) {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(title);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

export function logInfo(...message: any[]) {
  console.info(`[INFO] ${message}`);
}

export function logSuccess(...message: any[]) {
  console.log(`[SUCCESS] ${message}`);
}

export function logWarning(...message: any[]) {
  console.warn(`[WARNING] ${message}`);
}

export function logError(...message: any[]) {
  console.error(`[ERROR] ${message}`);
}

export function logFailure(...message: any[]) {
  console.error(`[FAILED] ${message}`);
}