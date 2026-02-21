import type { SupportedLocale as SuppoertedLocale } from "../strings/types";
export default function getIsoLangCodeByLocale(locale: SuppoertedLocale) {
  switch (locale) {
    case "en":
      return "en";
    case "zh":
      return "zh-CN";
    case "zh-tw":
      return "zh-TW";
  }
}
