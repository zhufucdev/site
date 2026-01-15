import {
  pgTable,
  integer,
  timestamp,
  text,
  boolean,
} from "drizzle-orm/pg-core";
import { localesEnum } from "./locale";
import { imagesTable } from "./images";

export const galleryTable = pgTable("gallery", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  locale: localesEnum(),
  tweet: text(),
  imageId: integer()
    .notNull()
    .references(() => imagesTable.id),
  created: timestamp().notNull().defaultNow(),
  trashed: boolean().notNull().default(false),
});
