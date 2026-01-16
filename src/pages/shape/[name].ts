import type { APIRoute, GetStaticPaths } from "astro";
import { shapeByName } from "../../shapes/by-name";
import { supportedShapes } from "../../shapes/types";
import type { SupportedShape } from "../../shapes/types";
import { getImage } from "astro:assets";

export const getStaticPaths = (() => {
  return supportedShapes.map((name) => ({ params: { name } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params, rewrite }) => {
  const { name } = params;
  const content = shapeByName[name as SupportedShape];
  return rewrite((await getImage({ src: content })).src);
};
