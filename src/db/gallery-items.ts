import type { SupportedLocale } from "../strings/types";
import db from "./connection";
import { galleryTable } from "./schema/gallery";
import { imagesTable } from "./schema/images";
import { and, desc, eq, isNull, not, or, type SQLWrapper } from "drizzle-orm";

export async function list({
  targetLocale,
  ignoreTrashed = false,
  limit,
}: {
  targetLocale?: SupportedLocale;
  ignoreTrashed?: boolean;
  limit?: number;
}) {
  const conditions: SQLWrapper[] = [];
  if (ignoreTrashed) {
    conditions.push(not(galleryTable.trashed));
  }
  if (typeof targetLocale === "string") {
    conditions.push(
      or(eq(galleryTable.locale, targetLocale), isNull(galleryTable.locale))!,
    );
  }
  const query = db
    .select({
      id: galleryTable.id,
      locale: galleryTable.locale,
      tweet: galleryTable.tweet,
      image: imagesTable.url,
      alt: imagesTable.alt,
      created: galleryTable.created,
      trashed: galleryTable.trashed,
    })
    .from(galleryTable)
    .orderBy(desc(galleryTable.created))
    .innerJoin(imagesTable, eq(galleryTable.imageId, imagesTable.id))
    .where(and(...conditions));
  if (typeof limit === "number") {
    return query.limit(limit);
  }
  return query;
}
