import type { APIRoute } from "astro";
import db from "../../../db/connection";
import { updatesTable } from "../../../db/schema/updates";
import { eq } from "drizzle-orm";
import { stringsTable } from "../../../db/schema/strings";
import verifyForm from "../../../utils/verify-form";
import { supportedLocales } from "../../../strings/types";

export const prerender = false;

export const DELETE: APIRoute = async ({ params }) => {
  const { id: _id } = params;
  if (typeof _id !== "string") {
    return new Response("id is required", { status: 400 });
  }
  const id = Number.parseInt(_id);
  if (!Number.isInteger(id)) {
    return new Response("id must be an integer", { status: 400 });
  }
  const deletedPosts = await db
    .delete(updatesTable)
    .where(eq(updatesTable.id, id))
    .returning();

  if (deletedPosts.length <= 0) {
    return new Response("Post not found", { status: 404 });
  }
  const { header, ...deletePost } = deletedPosts[0];
  if (typeof header !== "number") {
    return new Response(JSON.stringify(deletedPosts));
  }
  const headers = await db
    .select({ value: stringsTable.value })
    .from(stringsTable)
    .where(eq(stringsTable.id, header));
  return new Response(
    JSON.stringify({ header: headers[0].value, ...deletePost }),
  );
};

export const GET: APIRoute = async ({ params }) => {
  const { id: _id } = params;
  if (typeof _id !== "string") {
    return new Response("id is required", { status: 400 });
  }
  const id = Number.parseInt(_id);
  if (!Number.isInteger(id)) {
    return new Response("id must be an integer", { status: 400 });
  }
  const posts = await db
    .select({
      id: updatesTable.id,
      created: updatesTable.created,
      locale: updatesTable.locale,
      header: stringsTable.value,
      title: updatesTable.title,
      summary: updatesTable.summary,
      cover: updatesTable.cover,
      mask: updatesTable.mask,
      trashed: updatesTable.trashed,
    })
    .from(updatesTable)
    .where(eq(updatesTable.id, id))
    .leftJoin(stringsTable, eq(stringsTable.id, updatesTable.header));
  if (posts.length <= 0) {
    return new Response("Post not found", { status: 404 });
  }
  return new Response(JSON.stringify(posts[0]));
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
  const { locale, header, title, summary, cover, mask, trashed } = _body;
  try {
    verifyForm(_body, {
      ignoreUnknownKeys: true,
      expectedTypes: {
        locale: ["string", "undefined"],
        header: ["string", "undefined"],
        title: ["string", "undefined"],
        summary: ["string", "undefined"],
        cover: ["number", "undefined"],
        mask: ["string", "undefined"],
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
  const modifiedPosts = await db
    .update(updatesTable)
    .set({
      locale,
      header,
      title,
      summary,
      cover,
      mask,
      trashed,
    })
    .where(eq(updatesTable.id, id))
    .returning();
  if (modifiedPosts.length < 0) {
    return new Response("Post not found", { status: 404 });
  }
  const { header: headerId, ...modifiedPost } = modifiedPosts[0];
  const currentHeaders = await db
    .select({ value: stringsTable.value })
    .from(stringsTable)
    .where(eq(stringsTable.id, headerId));
  return new Response(
    JSON.stringify({ header: currentHeaders[0].value, ...modifiedPost }),
  );
};
