export type i18nStringKeys =
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
  | "asterisk_bad_at_gaming_span"
  | "steve_reeds_blog_para"
  | "oops_para"
  | "copy_failed_you_may_go_manual_para";
export type i18nFunctionKeys = "via_span";
export type i18nKeys = i18nStringKeys | i18nFunctionKeys;
export const supportedLocales = ["en", "zh", "zh-tw"] as const;
export type SupportedLocale = (typeof supportedLocales)[number];
export type I18nKv = { [key in i18nStringKeys]: string } & {
  [key in i18nFunctionKeys]: (...args: string[]) => string;
};
export type I18nResource = I18nKv & {
  localeName: SupportedLocale;
};
