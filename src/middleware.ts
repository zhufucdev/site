import type { MiddlewareHandler } from "astro";
import { articleIdByLegacyId } from "./legacy";
import { getAbsoluteLocaleUrl } from "astro:i18n";

const captureLegacyArticleId = /\/article\/(.*)\/?/g;
export const onRequest = ((context, next) => {
  const legacyArticleId = captureLegacyArticleId.exec(context.url.pathname);
  if (legacyArticleId) {
    const newArticle =
      articleIdByLegacyId[
        legacyArticleId[1]! as keyof typeof articleIdByLegacyId
      ];
    if (newArticle) {
      const [locale, newId] = newArticle;
      return context.redirect(
        getAbsoluteLocaleUrl(locale, `/article/${newId}`),
      );
    }
  }
  return next();
}) satisfies MiddlewareHandler;
