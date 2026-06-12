import type { ArticlesData } from "../article";

export default function getArticlesDataFromCollection(
  posts: { data: any; id: string }[],
): ArticlesData {
  return Map.groupBy(
    posts
      .filter(({ id }) => !id.startsWith(".")) // hide some articles
      .map(({ data, id }) => ({
        meta: {
          title: data.title,
          summary: data.summary,
          id,
        },
        created: data.created as number,
      }))
      .sort((a, b) => b.created - a.created),
    ({ created }) => new Date(created).getUTCFullYear(),
  )
    .entries()
    .map(([year, articles]) => ({
      year,
      articles: articles.map(({ meta }) => meta),
    }))
    .toArray();
}
