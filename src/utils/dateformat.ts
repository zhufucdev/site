import { format as formatFn, type Format } from "@formkit/tempo";

export default function formateDate(
  timestamp: number | Date,
  locale: string,
  form: "long" | "short",
) {
  let format: Format;
  if (form == "long") {
    format = { date: "long" };
  } else {
    switch (locale) {
      case "zh":
      case "zh-tw":
        format = "M月D日";
        break;
      default:
        format = "MMM. D";
    }
  }
  const dateString = formatFn(
    typeof timestamp === "number" ? new Date(timestamp) : timestamp,
    format,
    locale,
  );
  if (locale.startsWith("en") && form == "short") {
    // add st / nd / th suffix for suitable locales
    if (dateString.endsWith("1")) {
      return dateString + "st";
    } else if (dateString.endsWith("2")) {
      return dateString + "nd";
    } else {
      return dateString + "th";
    }
  }
  return dateString;
}
