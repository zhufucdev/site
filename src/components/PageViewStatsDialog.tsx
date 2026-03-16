import {
  createEffect,
  createResource,
  createSignal,
  For,
  Match,
  Switch,
} from "solid-js";
import { actions } from "astro:actions";
import Modal from "./Modal";
import CloseButton from "./CloseButton";

export interface PageViewStatsDialogProps {
  hash: string;
}

export default function PageViewStatsDialog(props: PageViewStatsDialogProps) {
  const section = () => props.hash;
  const [open, setOpen] = createSignal(location.hash == section());
  createEffect(() => {
    const listener = () => {
      setOpen(location.hash == section());
    };
    window.addEventListener("popstate", listener);
    return () => {
      setOpen(false);
      window.removeEventListener("popstate", listener);
    };
  });

  createEffect(() => {
    if (!open()) {
      location.hash = "";
    }
  });

  const [pageViews] = createResource(actions.getPageViews);

  return (
    <Modal
      open={open()}
      onClose={() => setOpen(false)}
      class="relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 space-y-2 rounded-2xl border-2 border-gray-700 p-6 max-sm:w-[calc(100vw-24px)] dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
    >
      <div class="flex flex-row justify-between gap-4 mb-4">
        <h1 class="text-2xl font-bold">Article views</h1>
        <CloseButton onClick={() => setOpen(false)} strokeWidth="3.5" />
      </div>
      <Switch fallback={<p>Loading...</p>}>
        <Match when={pageViews()?.error}>
          <p>{pageViews()!.error?.message}</p>
        </Match>
        <Match when={pageViews()?.data}>
          <For each={pageViews()!.data as [string, number][]}>
            {([pageId, views]) => (
              <div class="flex flex-row justify-between gap-4">
                <span class="line-clamp-1">{pageId}</span>
                <span>{views}</span>
              </div>
            )}
          </For>
        </Match>
      </Switch>
    </Modal>
  );
}
