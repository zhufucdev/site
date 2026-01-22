import { getAbsoluteLocaleUrl } from "astro:i18n";
import { createHighlighter } from "shiki";
import xmlFormat from "xml-formatter";
import { defaultLocale } from "../locale";
import { createResource, Match, Switch } from "solid-js";

const highlighter = await createHighlighter({
  themes: ["one-light", "vitesse-black"],
  langs: ["xml"],
});

interface Props {
  targetLocale?: string;
}

function removeSuffix(str: string, suffix: string) {
  if (str.endsWith(suffix)) {
    return str.slice(0, str.length - suffix.length);
  }
  return str;
}

export default function RssCodeFragment(props: Props) {
  const targetLocale = () => props.targetLocale ?? defaultLocale;
  const [rssText] = createResource(targetLocale(), (targetLocale) =>
    fetch(
      removeSuffix(getAbsoluteLocaleUrl(targetLocale, "/rss.xml"), "/"), // somewhat bugged
    ).then((res) => res.text()),
  );
  return (
    <Switch>
      <Match when={rssText()}>
        <div
          innerHTML={highlighter.codeToHtml(xmlFormat(rssText()!), {
            lang: "xml",
            themes: { light: "one-light", dark: "vitesse-black" },
          })}
        />
      </Match>
    </Switch>
  );
}
