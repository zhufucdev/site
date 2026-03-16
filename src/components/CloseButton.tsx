export default function CloseButton(props: {
  onClick: () => void;
  strokeWidth?: string;
  class?: string;
}) {
  const onClick = () => props.onClick;
  const className = () => props.class;
  return (
    <button onClick={onClick()} class={`cursor-pointer ${className()}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width={props.strokeWidth ?? "1.5"}
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
  );
}
