import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { AppleRainbow } from "./Icons.jsx";
import { closeWindow, openWindow, state, getEffectiveDate } from "../store.js";

export default function MenuBar(props) {
  const [open, setOpen] = createSignal(null);
  const [tick, setTick] = createSignal(0);

  onMount(() => {
    const t = setInterval(() => setTick((n) => n + 1), 5000);
    onCleanup(() => clearInterval(t));
  });

  const clock = () => {
    tick();
    return formatClock();
  };

  const toggle = (name) => setOpen((cur) => (cur === name ? null : name));
  const hover = (name) => open() && setOpen(name);
  const close = () => setOpen(null);
  const run = (fn) => {
    close();
    fn && fn();
  };

  return (
    <>
      <Show when={open()}>
        <div
          style={{ position: "absolute", inset: 0, "z-index": 9200 }}
          onClick={close}
        />
      </Show>

      <div class="menubar">
        <div
          class="menu-item apple"
          classList={{ open: open() === "apple" }}
          onClick={() => toggle("apple")}
          onMouseEnter={() => hover("apple")}
        >
          <AppleRainbow class="" />
        </div>

        <MenuTitle name="File" open={open()} toggle={toggle} hover={hover} />
        <MenuTitle name="Edit" open={open()} toggle={toggle} hover={hover} />
        <MenuTitle name="View" open={open()} toggle={toggle} hover={hover} />
        <MenuTitle name="Special" open={open()} toggle={toggle} hover={hover} />

        <div class="menu-spacer" />
        <div
          class="menu-clock"
          classList={{ "clock-custom": state.clockOverride !== null }}
          onClick={() => openWindow("clock")}
          title="Set date & time"
        >
          {clock()}
        </div>
      </div>

      <Show when={open() === "apple"}>
        <div class="dropdown" style={{ left: "6px" }}>
          <Row label="About This Developer…" onClick={() => run(() => openWindow("aboutmac"))} />
          <Sep />
          <Row label="Restart" onClick={() => run(props.onRestart)} />
          <Row label="Shut Down" onClick={() => run(props.onShutDown)} />
        </div>
      </Show>

      <Show when={open() === "file"}>
        <div class="dropdown" style={{ left: "44px" }}>
          <Row label="Open" hint="⌘O" onClick={() => run(() => openWindow("hd"))} />
          <Row
            label="Close Window"
            hint="⌘W"
            disabled={!state.active}
            onClick={() => run(() => state.active && closeWindow(state.active))}
          />
          <Sep />
          <Row label="Quit" hint="⌘Q" disabled />
        </div>
      </Show>

      <Show when={open() === "edit"}>
        <div class="dropdown" style={{ left: "92px" }}>
          <Row label="Undo" hint="⌘Z" disabled />
          <Sep />
          <Row label="Cut" hint="⌘X" disabled />
          <Row label="Copy" hint="⌘C" disabled />
          <Row label="Paste" hint="⌘V" disabled />
        </div>
      </Show>

      <Show when={open() === "view"}>
        <div class="dropdown" style={{ left: "140px" }}>
          <Row label="by Icon" disabled />
          <Row label="by Name" disabled />
          <Row label="by Date" disabled />
        </div>
      </Show>

      <Show when={open() === "special"}>
        <div class="dropdown" style={{ left: "192px" }}>
          <Row label="About" onClick={() => run(() => openWindow("about"))} />
          <Row label="Contact" onClick={() => run(() => openWindow("contact"))} />
          <Row label="Studio" onClick={() => run(() => openWindow("studio"))} />
        </div>
      </Show>
    </>
  );
}

function MenuTitle(props) {
  const key = () => props.name.toLowerCase();
  return (
    <div
      class="menu-item"
      classList={{ open: props.open === key() }}
      onClick={() => props.toggle(key())}
      onMouseEnter={() => props.hover(key())}
    >
      {props.name}
    </div>
  );
}

function Row(props) {
  return (
    <div
      class="dropdown-row"
      classList={{ disabled: props.disabled }}
      onClick={() => !props.disabled && props.onClick && props.onClick()}
    >
      <span>{props.label}</span>
      <Show when={props.hint}>
        <span>{props.hint}</span>
      </Show>
    </div>
  );
}

function Sep() {
  return <div class="dropdown-sep" />;
}

function formatClock() {
  const d = getEffectiveDate();
  const m = d.getMinutes().toString().padStart(2, "0");
  let h = d.getHours();
  if (state.clock24) {
    return `${h.toString().padStart(2, "0")}:${m}`;
  }
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
}
