import type { JSX } from "solid-js";
import ChunkyIconButton from "./ChunkyIconButton";
import type { I18nResource } from "../strings/types";

export interface SourceSectionProps {
  class?: string;
  source: string;
  license: string;
  i18n: I18nResource;
}

export default function SourceSection({
  source,
  license,
  class: className,
  i18n,
}: SourceSectionProps) {
  return (
    <div class={`flex flex-row flex-wrap content-around gap-6 ${className}`}>
      <div class="stroke-custom size-16 bg-[url(/git-icon.png)] bg-cover" />
      <div class="flex flex-col items-start">
        <p class="text-3xl">{i18n.get_source_code_para}</p>
        <div class="flex-1" />
        <div class="flex flex-row gap-4">
          <a href={source} target="_blank">
            <ChunkyIconButton>GitHub</ChunkyIconButton>
          </a>
          <a href={license} target="_blank">
            <ChunkyIconButton>License</ChunkyIconButton>
          </a>
        </div>
      </div>
    </div>
  );
}

function SourceBranchIcon(props: JSX.ImgHTMLAttributes<HTMLImageElement>) {
  return <img src="/git-icon.png" {...props} />;
}
