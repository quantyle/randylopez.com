import { Dynamic } from "solid-js/web";
import { Show, onMount } from "solid-js";
import { APPS } from "../apps.jsx";
import {
  closeWindow,
  fitWindowHeight,
  focusWindow,
  getScale,
  moveWindow,
  resizeWindow,
  state,
  MENUBAR_H,
  SCREEN,
} from "../store.js";

export default function Window(props) {
  const id = props.id;
  const app = APPS[id];
  const rect = () => state.rects[id];
  const isActive = () => state.active === id;
  let dragging = false;
  let winEl;

  onMount(() => {
    if (!app.autoHeight) return;
    requestAnimationFrame(() => {
      if (winEl) fitWindowHeight(id, winEl.offsetHeight);
    });
  });

  const startDrag = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    focusWindow(id);
    dragging = true;
    const scale = getScale();
    const r = rect();
    const sx = e.clientX;
    const sy = e.clientY;
    const ox = r.x;
    const oy = r.y;
    const move = (ev) => {
      moveWindow(id, ox + (ev.clientX - sx) / scale, oy + (ev.clientY - sy) / scale);
    };
    const up = () => {
      dragging = false;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const startResize = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    focusWindow(id);
    const scale = getScale();
    const r = rect();
    const sx = e.clientX;
    const sy = e.clientY;
    const ow = r.w;
    const oh = r.h;
    const move = (ev) => {
      resizeWindow(id, ow + (ev.clientX - sx) / scale, oh + (ev.clientY - sy) / scale);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div
      ref={winEl}
      class="window win-open"
      classList={{ inactive: !isActive(), dragging }}
      style={{
        left: `${rect().x}px`,
        top: `${rect().y}px`,
        width: `${rect().w}px`,
        height: app.autoHeight ? "auto" : `${rect().h}px`,
        "max-height": app.autoHeight
          ? `${SCREEN.h - MENUBAR_H - (SCREEN.w < 620 ? 16 : 28) * 2}px`
          : undefined,
        "z-index": props.z,
      }}
      onPointerDown={() => focusWindow(id)}
    >
      <div class="titlebar" onPointerDown={startDrag}>
        <div class="win-lights" onPointerDown={(e) => e.stopPropagation()}>
          <button
            class="light close"
            aria-label={`Close ${app.title}`}
            onClick={() => closeWindow(id)}
          >
            <svg class="glyph" viewBox="0 0 10 10" aria-hidden="true">
              <line x1="3" y1="3" x2="7" y2="7" />
              <line x1="7" y1="3" x2="3" y2="7" />
            </svg>
          </button>
          <button
            class="light min"
            aria-label="Minimize"
            onClick={() => closeWindow(id)}
          >
            <svg class="glyph" viewBox="0 0 10 10" aria-hidden="true">
              <line x1="2.5" y1="5" x2="7.5" y2="5" />
            </svg>
          </button>
        </div>
        <span class="title-text">{app.title}</span>
        <span class="lights-spacer" />
      </div>
      <div class="window-body">
        <Dynamic component={app.content} />
      </div>
      <Show when={!app.noResize && !app.autoHeight}>
        <div class="resize-grip" onPointerDown={startResize} />
      </Show>
    </div>
  );
}
