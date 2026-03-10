import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const visitsTable = pgTable(
  "visits",
  {
    pageId: text().notNull(),
    visitorId: varchar({ length: 32 }).notNull(),
    time: timestamp().notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.visitorId, table.pageId] })],
);

export const pageViewsTable = pgTable("page_views", {
  pageId: text().primaryKey().notNull(),
  views: integer().notNull().default(0),
});
