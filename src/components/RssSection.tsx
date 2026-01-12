import { createSignal, createMemo, type JSX } from "solid-js";
import type { I18nResource } from "../strings/types";
import ChunkyIconButton from "./ChunkyIconButton";
import Modal from "./Modal";
import { getAbsoluteLocaleUrl, getRelativeLocaleUrl } from "astro:i18n";

interface RssSectionProps {
  i18n: I18nResource;
  class?: string;
}

export default function RssSection(props: RssSectionProps) {
  const { i18n, class: className } = props;

  const rssUrl = createMemo(() =>
    getAbsoluteLocaleUrl(i18n.localeName, "/rss.xml"),
  );

  let buttonElement!: HTMLButtonElement;
  const [copied, setCopied] = createSignal<boolean>();
  const [showModal, setShowModel] = createSignal<boolean>();
  async function handleCopyButtonClick() {
    try {
      await navigator.clipboard.writeText(rssUrl());

      setCopied(!copied());
      setTimeout(() => {
        setCopied(false);
        buttonElement.blur();
      }, 2000);
    } catch (e) {
      console.error(e);
      buttonElement.blur();
      setShowModel(true);
    }
  }
  return (
    <>
      <Modal
        open={showModal()}
        onClose={() => setShowModel(false)}
        class="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-y-2 rounded-2xl border-2 border-gray-700 p-6 max-sm:w-[calc(100vw-24px)] dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
      >
        <div class="flex flex-row items-start justify-between">
          <span class="text-2xl font-semibold">{i18n.oops_para}</span>

          <button onClick={() => setShowModel(false)} class="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <p class="font-sans">{i18n.copy_failed_you_may_go_manual_para}</p>
        <input
          class="w-full font-mono outline-orange-500 focus:outline-2"
          readonly
          value={rssUrl()}
        ></input>
      </Modal>
      <div class={`flex flex-row flex-wrap content-around gap-6 ${className}`}>
        <RssIcon class="size-16 rounded-2xl border-2 border-gray-700 bg-orange-500 text-white dark:border-neutral-500" />
        <div class="flex flex-col items-start">
          <p class="text-3xl">{i18n.subsribe_via_rss_para}</p>
          <div class="flex-1" />
          <div class="flex flex-row gap-4">
            <ChunkyIconButton
              ref={buttonElement}
              onClick={handleCopyButtonClick}
              icon={
                <>
                  <ClipboardIcon
                    class="size-4"
                    classList={{
                      "transition-all": !copied(),
                      "transition-discrete": !copied(),
                      "opacity-0": copied(),
                    }}
                  />
                  <CheckIcon
                    class="absolute top-0 left-0 size-4 transition-all transition-discrete"
                    classList={{
                      "opacity-0": !copied(),
                    }}
                  />
                </>
              }
            >
              {i18n.copy_link_para}
            </ChunkyIconButton>
            <a href={getRelativeLocaleUrl(i18n.localeName, "articles")}>
              <ChunkyIconButton>{i18n.get_list_para}</ChunkyIconButton>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

function RssIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fill-rule="evenodd"
        d="M3.75 4.5a.75.75 0 0 1 .75-.75h.75c8.284 0 15 6.716 15 15v.75a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75C18 11.708 12.292 6 5.25 6H4.5a.75.75 0 0 1-.75-.75V4.5Zm0 6.75a.75.75 0 0 1 .75-.75h.75a8.25 8.25 0 0 1 8.25 8.25v.75a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75v-.75a6 6 0 0 0-6-6H4.5a.75.75 0 0 1-.75-.75v-.75Zm0 7.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
        clip-rule="evenodd"
      ></path>
    </svg>
  );
}

function ClipboardIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fill-rule="evenodd"
        d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 0 1-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0 1 13.5 1.5H15a3 3 0 0 1 2.663 1.618ZM12 4.5A1.5 1.5 0 0 1 13.5 3H15a1.5 1.5 0 0 1 1.5 1.5H12Z"
        clip-rule="evenodd"
      />
      <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 0 1 9 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0 1 16.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625v-12Z" />
      <path d="M10.5 10.5a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963 5.23 5.23 0 0 0-3.434-1.279h-1.875a.375.375 0 0 1-.375-.375V10.5Z" />
    </svg>
  );
}

function CheckIcon(props: JSX.SvgSVGAttributes<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fill-rule="evenodd"
        d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
        clip-rule="evenodd"
      />
    </svg>
  );
}
