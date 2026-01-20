import type { APIRoute } from "astro";
import { shapeByName } from "../../shapes/by-name";
import type { SupportedShape } from "../../shapes/types";
import { getImage } from "astro:assets";

export const prerender = false;

export const GET: APIRoute = async ({ params, rewrite }) => {
  const { name } = params;
  const content = shapeByName[name as SupportedShape];
  return rewrite((await getImage({ src: content })).src);
};
