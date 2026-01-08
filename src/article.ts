export interface Article {
  title: string;
  summary: string;
  created: number;
}

export type ArticlesData = ArticlesDatum[];

interface ArticlesDatum {
  year: number;
  articles: LinkedArticleMeta[];
}

interface LinkedArticleMeta {
  title: string;
  summary: string;
  href: string;
}
