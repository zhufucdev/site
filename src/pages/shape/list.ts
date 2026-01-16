import type { APIRoute } from "astro";
import { supportedShapes } from "../../shapes/types";

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(supportedShapes), {
    headers: { "Content-Type": "application/json" },
  });
};
