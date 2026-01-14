import {
  pgTable,
  integer,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { localesEnum } from "./locale";
import { imagesTable } from "./images";

export const galleryTable = pgTable("gallery", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  locale: localesEnum().notNull(),
  tweet: text(),
  imageId: integer()
    .notNull()
    .references(() => imagesTable.id),
  created: timestamp().notNull().defaultNow(),
});
