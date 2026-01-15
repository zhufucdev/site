import type { APIRoute } from "astro";
import db from "../../../db/connection";
import { imagesTable } from "../../../db/schema/images";

export const prerender = false;

export const GET: APIRoute = async () => {
  const images = await db
    .select({
      id: imagesTable.id,
      url: imagesTable.url,
      alt: imagesTable.alt,
    })
    .from(imagesTable);
  try {
    return new Response(JSON.stringify(images));
  } catch (e) {
    return new Response("[]", { status: 500 });
  }
};
