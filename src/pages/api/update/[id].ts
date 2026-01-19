import type { APIRoute } from "astro";
import db from "../../../db/connection";
import { updatesTable } from "../../../db/schema/updates";
import { eq } from "drizzle-orm";
import { stringsTable } from "../../../db/schema/strings";
import verifyForm from "../../../utils/verify-form";
import { supportedLocales } from "../../../strings/types";
import { query } from "../../../db/update-posts";

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
  const post = await query(id);
  if (!post) {
    return new Response("Post not found", { status: 404 });
  }
  return new Response(JSON.stringify(post));
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
  const {
    locale,
    header: headerText,
    title,
    summary,
    cover,
    mask,
    trashed,
  } = _body;
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
  const _posts = await db
    .select({ locale: updatesTable.locale, header: updatesTable.header })
    .from(updatesTable)
    .where(eq(updatesTable.id, id));
  if (_posts.length < 0) {
    return new Response("Post not found", { status: 404 });
  }
  const oldPost = _posts[0];
  let header = oldPost.header;

  if (typeof headerText === "string") {
    const modifiedHeaders = await db
      .insert(stringsTable)
      .values({ locale: oldPost.locale, value: headerText })
      .onConflictDoUpdate({
        target: [stringsTable.value, stringsTable.locale],
        set: { value: headerText }, // To still get something from returning clause
      })
      .returning({ id: stringsTable.id });
    header ??= modifiedHeaders[0]?.id;
  }
  await db
    .update(updatesTable)
    .set({
      header,
      locale,
      title,
      summary,
      cover: typeof cover === 'number' && cover === -1 ? null : cover,
      mask,
      trashed,
    })
    .where(eq(updatesTable.id, id));
  return new Response(JSON.stringify(await query(id)));
};
