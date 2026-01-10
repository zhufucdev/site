import type { APIRoute } from "astro";
import type { I18nResource } from "../strings/types";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getAbsoluteArticleUrl } from "./article-url";

export async function getRssResponse(i18n: I18nResource, site: string) {
  const posts = await getCollection(`articles-${i18n.localeName}`);
  return rss({
    title: i18n.steve_reeds_blog_para,
    description: i18n.steve_reeds_blog_para,
    site,
    items: posts.map(({ data, id }) => ({
      title: data.title,
      pubDate: data.created,
      description: data.summary,
      link: getAbsoluteArticleUrl(id, i18n.localeName),
    })),
    customData: `<language>${i18n.localeName}</language>`,
  });
}

export default function getRssXmlApiRoute(i18n: I18nResource) {
  return (async (context) => {
    const site = context.site?.toString();
    if (!site) {
      throw new Error("provide site in astro configuration");
    }
    return getRssResponse(i18n, site);
  }) satisfies APIRoute;
}
