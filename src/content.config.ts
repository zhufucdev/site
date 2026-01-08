import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { supportedLocales, type SupportedLocale } from "./strings/types";

function articlesCollectionGenerator(
  locale: string,
): ReturnType<typeof defineCollection> {
  return defineCollection({
    loader: glob({
      pattern: `*/${locale}.{md,mdx}`,
      base: "./src/content",
      generateId(options) {
        const [dirName, ..._] = options.entry.split("/");
        return dirName;
      },
    }),
    schema: z.object({
      title: z.string(),
      summary: z.string(),
      created: z.coerce.date(),
    }),
  });
}

// should produce something like { articles-en: <col>, articles-zh: <col>, articles-zh-tw: <col> }
export const collections = Object.fromEntries(
  supportedLocales.map((localeName) => [
    `articles-${localeName}`,
    articlesCollectionGenerator(localeName),
  ]),
) as {
  [key in `articles-${SupportedLocale}`]: ReturnType<typeof defineCollection>;
};
