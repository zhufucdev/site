import type { APIRoute } from "astro";
import { list } from "../../../db/gallery-items";
import databaseListHandler from "../../../utils/list-database";

export const prerender = false;

export const GET: APIRoute = databaseListHandler(list);
