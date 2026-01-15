import type { APIRoute } from "astro";
import db from "../../../db/connection";
import { galleryTable } from "../../../db/schema/gallery";
import { imagesTable } from "../../../db/schema/images";
import { eq } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { id: _id } = params;
  if (typeof _id === "undefined") {
    return new Response("id is required", { status: 400 });
  }
  const id = Number.parseInt(_id);
  if (!Number.isInteger(id)) {
    return new Response("Invalid id", { status: 400 });
  }
  const items = await db
    .select({
      id: galleryTable.id,
      locale: galleryTable.locale,
      tweet: galleryTable.tweet,
      image: imagesTable.url,
      created: galleryTable.created,
    })
    .from(galleryTable)
    .where(eq(galleryTable.id, id))
    .innerJoin(imagesTable, eq(galleryTable.imageId, imagesTable.id));
  if (items.length <= 0) {
    return new Response("Item not found", { status: 404 });
  }
  return new Response(JSON.stringify(items[0]));
};

export const DELETE: APIRoute = async ({ params }) => {
  const { id: _id } = params;
  if (typeof _id !== "string") {
    return new Response("id is required", { status: 400 });
  }
  const id = Number.parseInt(_id);
  if (!Number.isInteger(id)) {
    return new Response("Invalid id", { status: 400 });
  }
  const deletedItems = await db
    .delete(galleryTable)
    .where(eq(galleryTable.id, id))
    .returning();

  if (deletedItems.length <= 0) {
    return new Response("Item not found", { status: 404 });
  }
  const { imageId, ...deletedItem } = deletedItems[0];
  const images = await db
    .select({ url: imagesTable.url })
    .from(imagesTable)
    .where(eq(imagesTable.id, imageId));
  return new Response(JSON.stringify({ image: images[0].url, ...deletedItem }));
};

