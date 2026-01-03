export type i18nKeys =
  | "all_articles_para"
  | "highlights_para"
  | "about_me_para"
  | "read_full_para"
  | "subsribe_via_rss_para"
  | "copy_link_para"
  | "get_list_para"
  | "get_source_code_para"
  | "license_para";
export type I18nKv = { [key in i18nKeys]: string };
export type I18nResource = I18nKv & {
  localeName: string;
};
