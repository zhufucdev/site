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
      class="group relative flex cursor-pointer items-center gap-2 bg-black px-2 text-white transition-all hover:bg-orange-600 focus:bg-orange-600 dark:bg-zinc-100 dark:text-black dark:hover:text-white"
      {...extra}
    >
      <div class="absolute top-0 left-0 -z-10 h-[calc(100%+4px)] w-[calc(100%+4px)] bg-zinc-400 transition-all group-hover:translate-1 group-hover:bg-gray-300 dark:group-hover:bg-zinc-500" />
      {icon && <div class="relative">{icon}</div>}
      {children}
    </button>
  );
}
