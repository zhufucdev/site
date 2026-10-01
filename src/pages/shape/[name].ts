import type { APIRoute } from "astro";
import { shapeByName } from "../../shapes/by-name";
import type { SupportedShape } from "../../shapes/types";

export const GET: APIRoute = async ({ params }) => {
  const { name } = params;
  const content = shapeByName[name as SupportedShape];
  return new Response(content, {
    headers: { "Content-Type": "image/svg+xml" },
  });
};

export function getStaticPaths() {
  return Object.keys(shapeByName).map((name) => ({ params: { name } }));
}
