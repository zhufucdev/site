import { defineCollection } from "astro:content";
import { glob, type Loader, type LoaderContext } from "astro/loaders";
import { z } from "astro/zod";
import { supportedLocales, type SupportedLocale } from "./strings/types";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as yaml from "yaml";

type RenderedContent = Awaited<ReturnType<LoaderContext["renderMarkdown"]>>;
async function renderArticle(
  id: string,
  content: string,
  renderMarkdown: (content: string) => Promise<RenderedContent>,
): Promise<RenderedContent> {
  const [_, frontmatter, body] = content.split("---", 3);
  const metadata = yaml.parse(frontmatter);
  if (!metadata) {
    throw new Error(`No metadata for ${id}`);
  }
  const inner = await renderMarkdown(body);
  return {
    ...inner,
    metadata: { ...inner.metadata, ...metadata },
  };
}

function articleLoader(
  locale: string,
  contentDir: string = "./src/content",
): Loader {
  return {
    name: `article-loader-${locale}`,
    async load(ctx: LoaderContext) {
      const { store, renderMarkdown, parseData, generateDigest, logger } = ctx;
      store.clear();
      await Promise.all(
        (await fs.readdir(contentDir, { withFileTypes: true }))
          .filter((file) => file.isDirectory())
          .map(async (dir) => {
            for (const doc of await fs.readdir(
              path.join(dir.parentPath, dir.name),
            )) {
              if (doc == `${locale}.md` || doc == `${locale}.mdx`) {
                await glob({
                  base: path.join(dir.parentPath, dir.name),
                  pattern: doc,
                  generateId: () => dir.name,
                }).load(ctx);
                return;
              }
            }
            logger.warn(
              `No ${locale}.md or ${locale}.mdx found in ${dir.name}`,
            );
          }),
      );
    },
  };
}

function articlesCollectionGenerator(
  locale: string,
): ReturnType<typeof defineCollection> {
  return defineCollection({
    loader: articleLoader(locale),
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
