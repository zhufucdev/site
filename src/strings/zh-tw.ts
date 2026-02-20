import type { I18nResource } from "./types";

const zhTwRes: I18nResource = {
  localeName: "zh-tw",
  all_articles_para: "所有文章",
  highlights_para: "亮點",
  about_me_para: "關於我",
  read_full_para: "閱讀全文",
  subsribe_via_rss_para: "透過 RSS 訂閱",
  copy_link_para: "複製連結",
  get_list_para: "取得文章列表",
  get_source_code_para: "取得原碼",
  license_para: "許可證",
  reading_para: "正在讀",
  playing_para: "正在玩",
  socials_para: "社群媒體",
  asterisk_bad_at_gaming_span: "*不懂玩遊戲",
  via_span: (provider: string) => `透過${provider}`,
  steve_reeds_blog_para: "Steve Reed的部落格",
  oops_para: "哎呀，出錯了",
  copy_failed_you_may_go_manual_para: "複製失敗，你可以手動複製以下內容",
  page_not_found_para: "找不到指定頁面",
  go_home_para: "回到首頁",
  photo_para: "相片",
  loading_comments: "載入評論中…",
};

export default zhTwRes;
