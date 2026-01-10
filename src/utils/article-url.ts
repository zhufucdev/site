import { getAbsoluteLocaleUrl, getRelativeLocaleUrl } from "astro:i18n";

export function getAbsoluteArticleUrl(id: string, locale: string) {
  return getAbsoluteLocaleUrl(locale, `/article/${id}`);
}

export function getRelativeArticleUrl(id: string, locale: string) {
  return getRelativeLocaleUrl(locale, `/article/${id}`);
}
