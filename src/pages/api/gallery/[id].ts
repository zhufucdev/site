import type { APIRoute } from "astro";
import db from "../../../db/connection";
import { galleryTable } from "../../../db/schema/gallery";
import { imagesTable } from "../../../db/schema/images";
import { eq } from "drizzle-orm";
import verifyForm from "../../../utils/verify-form";
import { supportedLocales } from "../../../strings/types";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const { id: _id } = params;
  if (typeof _id !== "string") {
    return new Response("id is required", { status: 400 });
  }
  const id = Number.parseInt(_id);
  if (!Number.isInteger(id)) {
    return new Response("id must be an integer", { status: 400 });
  }
  const items = await db
    .select({
      id: galleryTable.id,
      locale: galleryTable.locale,
      tweet: galleryTable.tweet,
      image: imagesTable.url,
      created: galleryTable.created,
      trashed: galleryTable.trashed,
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
    return new Response("id must be an integer", { status: 400 });
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
    .select({ url: imagesTable.url, alt: imagesTable.alt })
    .from(imagesTable)
    .where(eq(imagesTable.id, imageId));
  return new Response(
    JSON.stringify({
      image: images[0].url,
      alt: images[0].alt,
      ...deletedItem,
    }),
  );
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const { id: _id } = params;
  if (typeof _id !== "string") {
    return new Response("id is required", { status: 400 });
  }
  const id = Number.parseInt(_id);
  if (!Number.isInteger(id)) {
    return new Response("id must be an integer", { status: 400 });
  }
  let _body;
  try {
    _body = JSON.parse(await request.text());
  } catch (e) {
    return new Response("Invalid body", { status: 400 });
  }
  const { locale, tweet, imageId, trashed } = _body;
  try {
    verifyForm(_body, {
      ignoreUnknownKeys: true,
      expectedTypes: {
        locale: ["string", "undefined", "null"],
        tweet: ["string", "undefined", "null"],
        imageId: ["number", "undefined"],
        trashed: ["boolean", "undefined"],
      },
    });
  } catch (e) {
    return new Response((e as Error).message, { status: 400 });
  }
  if (locale && !supportedLocales.includes(locale)) {
    return new Response(
      "locale must be one of " + supportedLocales.join(", "),
      { status: 400 },
    );
  }
  const modifiedItems = await db
    .update(galleryTable)
    .set({
      locale,
      tweet,
      imageId,
      trashed,
    })
    .where(eq(galleryTable.id, id))
    .returning();
  if (modifiedItems.length <= 0) {
    return new Response("Item not found", { status: 404 });
  }
  const { imageId: currentImageId, ...modifiedItem } = modifiedItems[0];
  const images = await db
    .select({ url: imagesTable.url, alt: imagesTable.alt })
    .from(imagesTable)
    .where(eq(imagesTable.id, currentImageId));
  return new Response(
    JSON.stringify({ image: images[0].url, alt: images[0].alt, ...modifiedItem }),
  );
};
