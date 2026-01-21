import { parse } from "dotenv";
import * as fs from "node:fs";

export default function loadEnv(): ImportMetaEnv {
  if (fs.existsSync(".env")) {
    return {
      ...parse(fs.readFileSync(".env")),
      ...(process.env as unknown as any),
    };
  }
  return process.env as unknown as ImportMetaEnv;
}
