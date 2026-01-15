import db from "./connection";
import { eq, inArray, not, and, type SQLWrapper, desc } from "drizzle-orm";
import { stringsTable } from "./schema/strings";
import { updatesTable } from "./schema/updates";
import { imagesTable } from "./schema/images";
import { supportedLocales, type SupportedLocale } from "../strings/types";

/**
 * List all update posts
 * @throws TypeError if any of the accepted locales is not supported
 * @throws DatabaseError if any
 */
export async function list({
  acceptedLocales,
  ignoreTrash = false,
  limit,
}: {
  acceptedLocales?: SupportedLocale[];
  ignoreTrash?: boolean;
  limit?: number;
}) {
  const conditions: SQLWrapper[] = [];
  if (ignoreTrash) {
    conditions.push(not(updatesTable.trashed));
  }
  if (typeof acceptedLocales !== "undefined") {
    for (const acceptedLocale of acceptedLocales) {
      if (!supportedLocales.includes(acceptedLocale)) {
        throw new TypeError("Invalid locale");
      }
    }
    conditions.push(inArray(updatesTable.locale, acceptedLocales));
  }
  let query = db
    .select({
      id: updatesTable.id,
      created: updatesTable.created,
      locale: updatesTable.locale,
      header: stringsTable.value,
      title: updatesTable.title,
      summary: updatesTable.summary,
      cover: {
        image: imagesTable.url,
        alt: imagesTable.alt,
      },
      mask: updatesTable.mask,
      trashed: updatesTable.trashed,
    })
    .from(updatesTable)
    .where(and(...conditions))
    .orderBy(desc(updatesTable.created))
    .innerJoin(stringsTable, eq(updatesTable.header, stringsTable.id))
    .leftJoin(imagesTable, eq(updatesTable.cover, imagesTable.id));
  if (typeof limit === "number") {
    return query.limit(limit);
  }
  return query;
}
