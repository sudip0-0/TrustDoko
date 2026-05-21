import { checkDatabaseConnection } from "@/lib/db/health";

export async function getDatabaseHealth() {
  const connected = await checkDatabaseConnection();
  return { connected };
}
