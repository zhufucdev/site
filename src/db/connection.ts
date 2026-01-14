import { drizzle } from "drizzle-orm/neon-http";
import loadEnv from "../utils/load-env";

const { DB_URL } = loadEnv();
if (!DB_URL) {
  throw new Error("DB_URL is not set");
}
export default drizzle(DB_URL);
