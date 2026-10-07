import type { APIRoute } from "astro";
import { svgByName } from "../../shapes/svg-by-name";
import type { SupportedShape } from "../../shapes/types";

export const GET: APIRoute = async ({ params }) => {
  const { name } = params;
  const content = svgByName[name as SupportedShape];
  return new Response(content, {
    headers: { "Content-Type": "image/svg+xml" },
  });
};

export function getStaticPaths() {
  return Object.keys(svgByName).map((name) => ({ params: { name } }));
}
