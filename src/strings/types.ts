export type i18nKeys =
  | "all_articles_para"
  | "highlights_para"
  | "about_me_para";
export type I18nKv = { [key in i18nKeys]: string };
export type I18nResource = I18nKv & {
  localeName: string;
};
