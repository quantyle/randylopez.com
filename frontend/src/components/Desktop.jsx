import { createSignal, For } from "solid-js";
import MenuBar from "./MenuBar.jsx";
import Window from "./Window.jsx";
import { APPS } from "../apps.jsx";
import { openWindow, state } from "../store.js";
import {
  FolderIcon,
  HardDiskIcon,
  MailIcon,
  StudioIcon,
} from "./Icons.jsx";

const DESK_ICONS = [
  { id: "hd", label: "System", Icon: HardDiskIcon, top: 68 },
  { id: "about", label: "About.txt", Icon: FolderIcon, top: 190 },
  { id: "contact", label: "Contact", Icon: MailIcon, top: 312 },
  { id: "studio", label: "Studio", Icon: StudioIcon, atBottom: true },
];

export default function Desktop(props) {
  const [sel, setSel] = createSignal(null);

  return (
    <div class="desktop" onClick={() => setSel(null)}>
      <MenuBar onRestart={props.onRestart} onShutDown={props.onShutDown} />

      <For each={DESK_ICONS}>
        {(it) => (
          <button
            class="icon"
            classList={{ selected: sel() === it.id }}
            style={
              it.atBottom
                ? { left: "20px", bottom: "20px", "z-index": 10 }
                : { left: "20px", top: `${it.top}px`, "z-index": 10 }
            }
            onClick={(e) => {
              e.stopPropagation();
              setSel(it.id);
              openWindow(it.id);
            }}
            onDblClick={(e) => {
              e.stopPropagation();
              openWindow(it.id);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openWindow(it.id);
              }
            }}
          >
            <span class="glyph">
              <it.Icon class="" />
            </span>
            <span class="label">{it.label}</span>
          </button>
        )}
      </For>

      <For each={state.windows}>
        {(w) => <Window id={w.id} z={w.z} />}
      </For>
    </div>
  );
}
