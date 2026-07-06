import { createStore } from "solid-js/store";
import { createSignal } from "solid-js";
import { APPS } from "./apps.jsx";

export const [getScale, setScale] = createSignal(1);

export const SCREEN = { w: 560, h: 424 };
export const MENUBAR_H = 40;

export function setScreen(w, h) {
  SCREEN.w = Math.round(w);
  SCREEN.h = Math.round(h);
}

const [state, setState] = createStore({
  windows: [],
  rects: {},
  topZ: 100,
  active: null,
  booted: false,
  clockOverride: null, // null = local time, or { h, m, ts }
  clock24: false, // false = 12-hour, true = 24-hour
});

export { state };

export function getEffectiveDate() {
  const ov = state.clockOverride;
  if (!ov) return new Date();
  const base = new Date();
  base.setHours(ov.h, ov.m, 0, 0);
  return new Date(base.getTime() + (Date.now() - ov.ts));
}

export function getEffectiveHour() {
  return getEffectiveDate().getHours();
}

export function setClockTime(h, m) {
  setState("clockOverride", { h: (h + 24) % 24, m: (m + 60) % 60, ts: Date.now() });
}

export function nudgeClockHour(delta) {
  const d = getEffectiveDate();
  setClockTime(d.getHours() + delta, d.getMinutes());
}

export function nudgeClockMinute(delta) {
  const d = getEffectiveDate();
  setClockTime(d.getHours(), d.getMinutes() + delta);
}

export function toggleClockMeridiem() {
  const d = getEffectiveDate();
  setClockTime(d.getHours() + 12, d.getMinutes());
}

export function setClock24(v) {
  setState("clock24", !!v);
}

export function resetClock() {
  setState("clockOverride", null);
}

function clampRect(r) {
  const w = Math.min(r.w, SCREEN.w - 8);
  const h = Math.min(r.h, SCREEN.h - MENUBAR_H - 8);
  const x = Math.max(2, Math.min(r.x, SCREEN.w - w - 2));
  const y = Math.max(MENUBAR_H + 2, Math.min(r.y, SCREEN.h - h - 2));
  return { x, y, w, h };
}

export function openWindow(id) {
  const app = APPS[id];
  if (!app) return;
  const exists = state.windows.find((w) => w.id === id);
  const z = state.topZ + 1;
  setState("topZ", z);
  setState("active", id);
  if (exists) {
    setState("windows", (ws) => ws.map((w) => (w.id === id ? { ...w, z } : w)));
    return;
  }
  const n = state.windows.length;
  const small = SCREEN.w < 620;
  const availH = SCREEN.h - MENUBAR_H;
  const margin = small ? 16 : 28;
  const maxW = SCREEN.w - margin * 2;
  const maxH = availH - margin * 2;
  let w;
  let h;
  if (app.size) {
    w = Math.min(app.size.w, maxW);
    h = Math.min(app.size.h, maxH);
  } else {
    const frac = small ? 0.9 : 0.75;
    w = Math.round(SCREEN.w * frac);
    h = Math.round(availH * frac);
  }
  const cx = (SCREEN.w - w) / 2;
  const cy = MENUBAR_H + (availH - h) / 2;
  const cascade = (n % 5) * 16;
  const rect = clampRect({ x: cx + cascade, y: cy + cascade, w, h });
  setState("rects", id, rect);
  setState("windows", (ws) => [...ws, { id, z }]);
}

export function closeWindow(id) {
  setState("windows", (ws) => ws.filter((w) => w.id !== id));
  if (state.active === id) {
    const rest = state.windows.filter((w) => w.id !== id);
    const top = rest.reduce((a, b) => (b.z > (a?.z ?? -1) ? b : a), null);
    setState("active", top ? top.id : null);
  }
}

export function focusWindow(id) {
  if (state.active === id && topMost(id)) return;
  const z = state.topZ + 1;
  setState("topZ", z);
  setState("active", id);
  setState("windows", (ws) => ws.map((w) => (w.id === id ? { ...w, z } : w)));
}

function topMost(id) {
  const win = state.windows.find((w) => w.id === id);
  if (!win) return false;
  return state.windows.every((w) => w.z <= win.z);
}

export function moveWindow(id, x, y) {
  const r = state.rects[id];
  setState("rects", id, clampRect({ ...r, x, y }));
}

export function resizeWindow(id, w, h) {
  const r = state.rects[id];
  const app = APPS[id];
  const minW = app?.min?.w ?? 200;
  const minH = app?.min?.h ?? 120;
  setState(
    "rects",
    id,
    clampRect({ ...r, w: Math.max(minW, w), h: Math.max(minH, h) })
  );
}

export function fitWindowHeight(id, contentH) {
  const r = state.rects[id];
  if (!r) return;
  const small = SCREEN.w < 620;
  const margin = small ? 16 : 28;
  const maxH = SCREEN.h - MENUBAR_H - margin * 2;
  const h = Math.max(120, Math.min(Math.round(contentH), maxH));
  const availH = SCREEN.h - MENUBAR_H;
  const y = Math.round(MENUBAR_H + (availH - h) / 2);
  setState("rects", id, clampRect({ ...r, h, y }));
}

export function setBooted(v) {
  setState("booted", v);
}
