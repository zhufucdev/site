import db from "../db/connection";
import { eq, sql } from "drizzle-orm";
import { pageViewsTable } from "../db/schema/page-views";
import type { AstroSession } from "astro";
import { visitTtlSeconds } from "../sessions";

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
        Date.now() - timestamp.getTime() >= visitTtlSeconds * 1000,
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
  fingerprintByIpKv: KVNamespace,
  clientAddress: string,
) {
  return (await fingerprintByIpKv.list()).keys.reduce(
    (acc, curr) => (curr.name === clientAddress ? acc + 1 : acc),
    0,
  );
}

export async function incrementViews(pageId: string, session: AstroSession) {
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
    });
    session.set("pageViews", pageViews);
  }
  return page.views;
}

export async function shouldIncrementViews(
  pageId: string,
  session: AstroSession,
  fingerprintByIpKv: KVNamespace,
  clientAddress: string,
) {
  return (
    (await ipPoolSize(fingerprintByIpKv, clientAddress)) <= 10 &&
    ((await visitExpired(session)) || (await notVisited(session, pageId)))
  );
}

export async function getViews(
  pageId: string,
  session: AstroSession | undefined,
  runtime: Env,
  clientAddress: string,
) {
  const visitorId: string | undefined = await session?.get("fingerprint");
  if (!session || typeof visitorId == "undefined") {
    return await getViewsFromDb(pageId);
  }

  if (
    await shouldIncrementViews(
      pageId,
      session,
      runtime.FINGERPRINT_BY_IP,
      clientAddress,
    )
  ) {
    return await incrementViews(pageId, session);
  } else {
    return await getViewsFromDb(pageId);
  }
}
