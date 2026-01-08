export type i18nKeys =
  | "all_articles_para"
  | "highlights_para"
  | "about_me_para"
  | "read_full_para"
  | "subsribe_via_rss_para"
  | "copy_link_para"
  | "get_list_para"
  | "get_source_code_para"
  | "license_para"
  | "reading_para"
  | "playing_para"
  | "socials_para"
  | "asterisk_bad_at_gaming_span";
export const supportedLocales = ["en", "zh", "zh-tw"] as const;
export type SupportedLocale = (typeof supportedLocales)[number];
export type I18nKv = { [key in i18nKeys]: string };
export type I18nResource = I18nKv & {
  localeName: SupportedLocale;
};
