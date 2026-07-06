import { onCleanup, onMount } from "solid-js";

export default function BootSequence(props) {
  const timers = [];

  const finish = () => {
    timers.forEach(clearTimeout);
    props.onDone();
  };

  onMount(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timers.push(setTimeout(finish, reduce ? 200 : 500));
  });

  onCleanup(() => timers.forEach(clearTimeout));

  return (
    <div class="boot" onClick={finish} title="Click to skip">
      <div class="load">
        <div class="load-title">
          Loading
          <span class="load-dots">
            <i>.</i>
            <i>.</i>
            <i>.</i>
          </span>
        </div>
      </div>
    </div>
  );
}
