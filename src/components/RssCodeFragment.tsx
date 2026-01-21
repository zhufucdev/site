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

export default function RssCodeFragment(props: Props) {
  const targetLocale = () => props.targetLocale ?? defaultLocale;
  const [rssText] = createResource(targetLocale(), (targetLocale) =>
    fetch(getAbsoluteLocaleUrl(targetLocale, "/rss.xml")).then((res) =>
      res.text(),
    ),
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
