import { pgEnum } from "drizzle-orm/pg-core";
import { supportedShapes } from "../../shapes/types";

export const shapesEnum = pgEnum("shape", supportedShapes);
