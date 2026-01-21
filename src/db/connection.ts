import { drizzle } from "drizzle-orm/neon-http";

const { DB_URL } = import.meta.env;
if (!DB_URL) {
  throw new Error("DB_URL is not set");
}
export default drizzle(DB_URL);
