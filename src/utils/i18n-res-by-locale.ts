import type { I18nResource, SupportedLocale } from "../strings/types";
import enRes from "../strings/en";
import zhRes from "../strings/zh";
import zhTwRes from "../strings/zh-tw";

export default function getI18nResByLocale(
  name: SupportedLocale,
): I18nResource {
  switch (name) {
    case "en":
      return enRes;
    case "zh":
      return zhRes;
    case "zh-tw":
      return zhTwRes;
    default:
      return enRes;
  }
}
