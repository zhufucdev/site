import { pgTable, integer, text } from "drizzle-orm/pg-core";

export const imagesTable = pgTable("images", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  url: text().notNull().unique(),
  alt: text().notNull(),
});
