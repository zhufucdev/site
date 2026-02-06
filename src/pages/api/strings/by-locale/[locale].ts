import type { APIRoute } from "astro";
import db from "../../../../db/connection";
import { stringsTable } from "../../../../db/schema/strings";
import {
  supportedLocales,
  type SupportedLocale,
} from "../../../../strings/types";
import { eq } from "drizzle-orm";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  let { locale } = params;
  if (
    typeof locale !== "string" ||
    !supportedLocales.includes(locale as SupportedLocale)
  ) {
    return new Response("locale path component is required", { status: 400 });
  }
  const strings = await db
    .select({ value: stringsTable.value })
    .from(stringsTable)
    .where(eq(stringsTable.locale, locale as SupportedLocale));
  return new Response(JSON.stringify(strings.map(({ value }) => value)), {
    headers: { "Content-Type": "application/json" },
  });
};
