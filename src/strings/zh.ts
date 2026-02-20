import type { I18nResource } from "./types";

const zhRes: I18nResource = {
  localeName: "zh",
  all_articles_para: "所有文章",
  highlights_para: "亮点",
  about_me_para: "关于我",
  read_full_para: "阅读全文",
  subsribe_via_rss_para: "通过 RSS 订阅",
  copy_link_para: "复制链接",
  get_list_para: "获取文章列表",
  get_source_code_para: "获取源代码",
  license_para: "许可证",
  reading_para: "正在读",
  playing_para: "正在玩",
  socials_para: "社交媒体",
  asterisk_bad_at_gaming_span: "*不懂玩游戏",
  via_span: (provider: string) => `通过${provider}`,
  steve_reeds_blog_para: "Steve Reed的博客",
  oops_para: "哎呀，出错了",
  copy_failed_you_may_go_manual_para: "复制失败，你可以手动复制以下内容",
  page_not_found_para: "找不到指定页面",
  go_home_para: "回到首页",
  photo_para: "照片",
  loading_comments: "加载评论中…"
};

export default zhRes;
