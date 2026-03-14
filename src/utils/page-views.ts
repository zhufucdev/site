import db from "../db/connection";
import { eq, sql } from "drizzle-orm";
import { pageViewsTable } from "../db/schema/page-views";
import * as devalue from "devalue";
import type { AstroSession } from "astro";

async function getViewsFromDb(pageId: string) {
  const [page] = await db
    .select({ views: pageViewsTable.views })
    .from(pageViewsTable)
    .where(eq(pageViewsTable.pageId, pageId));
  return page?.views ?? 0;
}

async function visitExpired(session: AstroSession) {
  const pageViews = await session.get("pageViews");
  const expired =
    pageViews?.filter(
      ({ timestamp }) =>
        Date.now() - timestamp.getTime() >= 1000 * 60 * 60 * 24, // one day
    ) ?? [];
  if (expired.length <= 0) {
    return false;
  }
  session.set(
    "pageViews",
    pageViews!.filter((item) => !expired.includes(item)),
  );
  return true;
}

async function notVisited(session: AstroSession, pageId: string) {
  return (
    (await session.get("pageViews"))?.find((item) => pageId === item.pageId) ===
    undefined
  );
}

async function ipPoolSize(
  kv: KVNamespace,
  pageId: string,
  clientAddress: string,
) {
  const keys = (await kv.list()).keys;
  let poolSize = 0;
  for (const { name } of keys) {
    const value: App.SessionData = devalue.parse((await kv.get(name))!);
    for (const item of value.pageViews ?? []) {
      if (item.pageId === pageId && item.ip == clientAddress) {
        poolSize++;
      }
    }
  }
  return poolSize;
}

export async function getViews(
  pageId: string,
  session: AstroSession | undefined,
  kv: KVNamespace,
  clientAddress: string,
) {
  let visitorId: string | undefined = await session?.get("fingerprint");
  if (!session || typeof visitorId == "undefined") {
    return await getViewsFromDb(pageId);
  }

  if (
    (await ipPoolSize(kv, pageId, clientAddress)) <= 10 &&
    ((await visitExpired(session)) || (await notVisited(session, pageId)))
  ) {
    const [page] = await db
      .insert(pageViewsTable)
      .values({ pageId, views: 1 })
      .onConflictDoUpdate({
        target: pageViewsTable.pageId,
        set: { views: sql`${pageViewsTable.views} + 1` },
      })
      .returning({ views: pageViewsTable.views });
    const pageViews = (await session.get("pageViews")) ?? [];
    if (!pageViews.find((item) => item.pageId === pageId)) {
      pageViews.push({
        pageId,
        timestamp: new Date(),
        ip: clientAddress,
      });
      session.set("pageViews", pageViews);
    }
    return page.views;
  } else {
    return await getViewsFromDb(pageId);
  }
}
