import type { APIRoute } from "astro";
import { updatesTable } from "../../../db/schema/updates";
import db from "../../../db/connection";
import { supportedLocales } from "../../../strings/types";
import { stringsTable } from "../../../db/schema/strings";
import { and, eq } from "drizzle-orm";
import verifyForm from "../../../utils/verify-form";

export const prerender = false;

export const PUT: APIRoute = async ({ request }) => {
  let _body;
  try {
    _body = JSON.parse(await request.text());
  } catch (e) {
    return new Response("body must be a JSON string", { status: 400 });
  }
  const {
    created,
    header,
    cover,
    ...newPost
  }: Omit<typeof updatesTable.$inferInsert, "header"> & { header?: string } =
    _body;
  if (typeof header !== "string") {
    return new Response("header must be a string", { status: 400 });
  }

  if (!supportedLocales.includes(newPost.locale)) {
    return new Response(
      "locale must be one of " + supportedLocales.join(", "),
      { status: 400 },
    );
  }
  try {
    verifyForm(_body, {
      expectedTypes: {
        locale: "string",
        header: "string",
        title: "string",
        summary: "string",
        cover: "number",
        mask: "string",
        trashed: "boolean",
      },
      ignoreUnknownKeys: true,
    });
  } catch (e) {
    return new Response((e as Error).message, { status: 400 });
  }
  try {
    let matchingHeaders = await db
      .insert(stringsTable)
      .values({ locale: newPost.locale, value: header })
      .onConflictDoNothing()
      .returning({ id: stringsTable.id });
    if (matchingHeaders.length <= 0) {
      matchingHeaders = await db
        .select({ id: stringsTable.id })
        .from(stringsTable)
        .where(
          and(
            eq(stringsTable.locale, newPost.locale),
            eq(stringsTable.value, header),
          ),
        );
    }
    const newPosts = await db
      .insert(updatesTable)
      .values({
        header: matchingHeaders[0].id,
        cover: cover === -1 ? null : cover,
        ...newPost,
      })
      .returning({ id: updatesTable.id });
    return new Response(String(newPosts[0].id), {
      status: 201,
    });
  } catch (e) {
    console.error("Error creating update post:");
    console.error(e);
    return new Response("Creation failed", { status: 500 });
  }
};
