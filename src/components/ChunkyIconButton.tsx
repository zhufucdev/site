import type { JSX } from "solid-js";

export interface ChunkyIconButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  children: JSX.Element;
  icon?: JSX.Element;
}

export default function ChunkyIconButton({
  children,
  icon,
  ...extra
}: ChunkyIconButtonProps) {
  return (
    <button
      class="group relative flex cursor-pointer items-center gap-2 bg-black px-2 text-white transition-all hover:bg-orange-600 focus:bg-orange-600"
      {...extra}
    >
      <div class="absolute top-0 left-0 -z-10 h-[calc(100%+4px)] w-[calc(100%+4px)] bg-gray-400 transition-all group-hover:translate-1 group-hover:bg-gray-300" />
      {icon && <div class="relative">{icon}</div>}
      {children}
    </button>
  );
}
