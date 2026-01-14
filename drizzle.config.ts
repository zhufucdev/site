import { defineConfig } from "drizzle-kit";
import loadEnv from "./src/utils/load-env";

const { DB_URL } = loadEnv();
if (!DB_URL) {
  throw new Error("DB_URL is not set");
}
export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: DB_URL,
  },
});
