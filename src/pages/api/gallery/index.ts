import type { APIRoute } from "astro";
import { supportedLocales, type SupportedLocale } from "../../../strings/types";
import verifyForm from "../../../utils/verify-form";
import db from "../../../db/connection";
import { galleryTable } from "../../../db/schema/gallery";

export const prerender = false;

export const PUT: APIRoute = async ({ request }) => {
  let _body;
  try {
    _body = JSON.parse(await request.text());
  } catch {
    return new Response("body must be a JSON string", { status: 400 });
  }
  const { locale, tweet, imageId } = _body;
  if (
    typeof locale === "string" &&
    !supportedLocales.includes(locale as SupportedLocale)
  ) {
    return new Response(
      "locale must be one of " + supportedLocales.join(", "),
      { status: 400 },
    );
  }
  try {
    verifyForm(_body, {
      expectedTypes: {
        locale: ["string", "null"],
        tweet: ["string", "null"],
        imageId: "number",
      },
    });
  } catch (e) {
    return new Response((e as Error).message, { status: 400 });
  }
  try {
    const newItems = await db
      .insert(galleryTable)
      .values({ locale, tweet, imageId })
      .returning({ id: galleryTable.id });
    return new Response(String(newItems[0].id), { status: 201 });
  } catch (e) {
    console.error("Failed to create gallery item");
    console.error(e);
    return new Response("Creation failed", { status: 500 });
  }
};
