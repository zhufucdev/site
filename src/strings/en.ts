import type { I18nResource } from "./types";

const enRes: I18nResource = {
  localeName: "en",
  all_articles_para: "All articles",
  highlights_para: "Highlights",
  about_me_para: "About me",
  read_full_para: "Read full",
  subsribe_via_rss_para: "Subsribe via RSS",
  copy_link_para: "Copy link",
  get_list_para: "Get list",
  get_source_code_para: "Get source code",
  license_para: "License",
  reading_para: "Reading",
  playing_para: "Playing",
  socials_para: "Socials",
  asterisk_bad_at_gaming_span: "*bad at gaming",
  via_span: (provider: string) => `via ${provider}`,
  steve_reeds_blog_para: "Steve Reed's blog",
  oops_para: "Oops",
  copy_failed_you_may_go_manual_para:
    "Copy failed. You may manually copy the content below.",
  page_not_found_para: "The page you are looking for was not found",
  go_home_para: "Go home",
  photo_para: "Photo",
  loading_comments: "Loading comments…",
};

export default enRes;
