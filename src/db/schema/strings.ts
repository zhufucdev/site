import {
  pgTable,
  integer,
  varchar,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";
import { localesEnum } from "./locale";

/**
 * DO NOT store unreusble strings in this table
 */
export const stringsTable = pgTable(
  "strings",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    value: varchar().notNull(),
    locale: localesEnum().notNull(),
  },
  (table) => [
    unique("strings_value_locale_uniqueConstraint").on(
      table.locale,
      table.value,
    ),
  ],
);
