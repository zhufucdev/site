import type { APIRoute } from "astro";
import { type SupportedLocale } from "../strings/types";

export default function databaseListHandler<T>(
  list: (opts: {
    acceptedLocales?: SupportedLocale[];
    limit?: number;
  }) => Promise<T[]>,
): APIRoute {
  return async ({ url }) => {
    const acceptedLocales = url.searchParams.get("locale")?.split(" ") as
      | SupportedLocale[]
      | undefined;
    const _limit = url.searchParams.get("limit");
    let limit;
    if (_limit) {
      limit = Number.parseInt(_limit);
      if (!Number.isInteger(limit)) {
        return new Response("limit must be a integer", { status: 400 });
      }
    }
    try {
      return new Response(
        JSON.stringify(await list({ acceptedLocales, limit })),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (e) {
      if (e instanceof TypeError) {
        return new Response(e.message, { status: 400 });
      }
      return new Response("[]", { status: 500 });
    }
  };
}
