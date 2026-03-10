import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const articlesTable = pgTable("articles", {
  id: text().primaryKey(),
  views: integer().notNull().default(0),
});
