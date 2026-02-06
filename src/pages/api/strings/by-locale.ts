import type { APIRoute } from "astro";
import db from "../../../db/connection";
import { stringsTable } from "../../../db/schema/strings";
import type { SupportedLocale } from "../../../strings/types";

export const prerender = false;

export const GET: APIRoute = async () => {
  const strings = await db
    .select({ value: stringsTable.value, locale: stringsTable.locale })
    .from(stringsTable);
  let grouped: { [key in SupportedLocale]: string[] } = {} as any;
  for (const { locale, value } of strings) {
    if (!grouped[locale]) {
      grouped[locale] = [];
    }
    grouped[locale].push(value);
  }
  return new Response(JSON.stringify(grouped), {
    headers: { "Content-Type": "application/json" },
  });
};
