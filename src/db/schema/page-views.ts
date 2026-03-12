import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const pageViewsTable = pgTable("page_views", {
  pageId: text().primaryKey().notNull(),
  views: integer().notNull().default(0),
});
