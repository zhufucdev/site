import { loadEnv as loadEnvVite } from "vite";

export default function loadEnv(): EnviromentVariables {
  return loadEnvVite(process.env.NODE_ENV ?? "release", process.cwd(), "");
}
