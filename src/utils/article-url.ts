import { getAbsoluteLocaleUrl } from "astro:i18n";

export default function getArticleUrl(id: string, locale: string) {
  return getAbsoluteLocaleUrl(locale, `/article/${id}`);
}
