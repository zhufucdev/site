import { createEffect, type JSX } from "solid-js";

export interface ModalProps {
  open?: boolean;
  onClose?: () => void;
  class?: string;
  children?: JSX.Element;
}

export default function Modal(props: ModalProps) {
  let ref!: HTMLDialogElement;
  const open = () => props.open;
  createEffect(() => {
    console.log(open());
    if (open()) {
      ref.showModal();
    } else {
      ref.close();
    }
  });
  return (
    <dialog ref={ref} class={props.class} onClose={props.onClose}>
      {props.children}
    </dialog>
  );
}
