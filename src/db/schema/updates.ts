import {
  pgTable,
  integer,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { stringsTable } from "./strings";
import { localesEnum } from "./locale";
import { shapesEnum } from "./shapes";
import { imagesTable } from "./images";

export const updatesTable = pgTable("updates", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  created: timestamp().notNull().defaultNow(),
  locale: localesEnum().notNull(),
  header: integer().notNull().references(() => stringsTable.id, { onDelete: "restrict" }),
  title: text().notNull(),
  summary: text().notNull(),
  cover: integer().references(() => imagesTable.id, { onDelete: "set null" }),
  mask: shapesEnum().notNull(),
  trashed: boolean().notNull().default(false),
});
