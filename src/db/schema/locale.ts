import { pgEnum } from "drizzle-orm/pg-core";
import { supportedLocales } from "../../strings/types";

export const localesEnum = pgEnum("locale", supportedLocales);
