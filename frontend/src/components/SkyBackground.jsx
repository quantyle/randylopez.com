import { onMount, onCleanup } from "solid-js";

// 12 sky palettes across the day, indexed by Math.floor(localHour / 2).
// Each: Vanta Clouds colors + a CSS fallback gradient (shown until the WebGL
// canvas renders, or if WebGL is unavailable).
const SKIES = [
  // 0 — 00:00 midnight
  { label: "midnight", sky: 0x0a1730, cloud: 0x28344e, cloudShadow: 0x050d1c, sun: 0xaab8d6, sunGlare: 0x3c4c6c, sunlight: 0x6a7a9c, speed: 0.5, bg: ["#081226", "#0d1830", "#14223c"] },
  // 1 — 02:00 deep night
  { label: "deep night", sky: 0x0c1832, cloud: 0x2a3650, cloudShadow: 0x060e1d, sun: 0x9fb0d0, sunGlare: 0x3a4a68, sunlight: 0x66769a, speed: 0.5, bg: ["#091428", "#0e1a34", "#15243e"] },
  // 2 — 04:00 pre-dawn
  { label: "pre-dawn", sky: 0x223052, cloud: 0x44465f, cloudShadow: 0x161a30, sun: 0xc07a72, sunGlare: 0x8a5560, sunlight: 0xa86e6a, speed: 0.55, bg: ["#1a2440", "#2a3052", "#4a4260"] },
  // 3 — 06:00 sunrise
  { label: "sunrise", sky: 0x7e86b4, cloud: 0xe6b6a2, cloudShadow: 0x534064, sun: 0xffb368, sunGlare: 0xff885a, sunlight: 0xffab68, speed: 0.6, bg: ["#6a6fa6", "#c79a9e", "#f0c2a0"] },
  // 4 — 08:00 morning
  { label: "morning", sky: 0x77add9, cloud: 0xccd8e6, cloudShadow: 0x4d6c8c, sun: 0xfff0c8, sunGlare: 0xffd488, sunlight: 0xffe2a8, speed: 0.65, bg: ["#6aa0d2", "#9cc2e0", "#cfe4f0"] },
  // 5 — 10:00 late morning
  { label: "late morning", sky: 0x68b8d7, cloud: 0xc8d4e0, cloudShadow: 0x3e5e7c, sun: 0xffeab2, sunGlare: 0xffcd8a, sunlight: 0xffda9c, speed: 0.7, bg: ["#5aacd4", "#8cc6e2", "#c2e2ee"] },
  // 6 — 12:00 midday
  { label: "midday", sky: 0x5cb0e2, cloud: 0xeff5fb, cloudShadow: 0x4c6c8c, sun: 0xffffe2, sunGlare: 0xfff0b4, sunlight: 0xfff6cc, speed: 0.7, bg: ["#4fa8de", "#86c4ea", "#c4e6f4"] },
  // 7 — 14:00 afternoon
  { label: "afternoon", sky: 0x66a6d6, cloud: 0xdde7f1, cloudShadow: 0x4a6a88, sun: 0xffeec4, sunGlare: 0xffd894, sunlight: 0xffe6b4, speed: 0.7, bg: ["#5c9cd0", "#8cbfe0", "#c2dfee"] },
  // 8 — 16:00 late afternoon (golden)
  { label: "golden hour", sky: 0x84b4cf, cloud: 0xece0cc, cloudShadow: 0x5e5a68, sun: 0xffcc78, sunGlare: 0xffab56, sunlight: 0xffc06e, speed: 0.65, bg: ["#78aac8", "#c9c2b0", "#f0d8b0"] },
  // 9 — 18:00 sunset
  { label: "sunset", sky: 0xd98a72, cloud: 0xf2a884, cloudShadow: 0x6b3a58, sun: 0xff7330, sunGlare: 0xff5220, sunlight: 0xff8442, speed: 0.6, bg: ["#c56a5e", "#e29a72", "#f4c08c"] },
  // 10 — 20:00 dusk
  { label: "dusk", sky: 0x3c4a74, cloud: 0x6a5a76, cloudShadow: 0x2a2a46, sun: 0xd26a54, sunGlare: 0xa04a48, sunlight: 0xc06a54, speed: 0.55, bg: ["#2e3458", "#4a4468", "#6a4e60"] },
  // 11 — 22:00 night
  { label: "night", sky: 0x121f3c, cloud: 0x303c58, cloudShadow: 0x0a1426, sun: 0x8a9ec2, sunGlare: 0x4a5a7c, sunlight: 0x6a7a9c, speed: 0.5, bg: ["#0c1730", "#14213c", "#1c2c48"] },
];

// Sky is fixed to one default palette — no time-of-day changes.
const DEFAULT_SKY = 11; // night (deep blue night sky)
function paletteForNow() {
  return SKIES[DEFAULT_SKY];
}

// Make clouds livelier than the palette defaults (more chaotic drift).
const SPEED = 1.8;

export default function SkyBackground(props) {
  let el;
  let effect;
  let disposed = false;
  let lastIdx = -1;
  const p = paletteForNow();

  // Apply the current time-of-day palette to the running effect + fallback.
  const applyPalette = (force) => {
    const pal = paletteForNow();
    const idx = SKIES.indexOf(pal);
    if (!force && idx === lastIdx) return;
    lastIdx = idx;
    if (el) {
      el.style.background = `linear-gradient(180deg, ${pal.bg[0]} 0%, ${pal.bg[1]} 50%, ${pal.bg[2]} 100%)`;
    }
    if (effect && typeof effect.setOptions === "function") {
      try {
        effect.setOptions({
          skyColor: pal.sky,
          cloudColor: pal.cloud,
          cloudShadowColor: pal.cloudShadow,
          sunColor: pal.sun,
          sunGlareColor: pal.sunGlare,
          sunlightColor: pal.sunlight,
          speed: pal.speed * SPEED,
        });
      } catch (e) {
        /* ignore */
      }
    }
  };

  onMount(async () => {
    try {
      const THREE = await import("three");
      const mod = await import("vanta/dist/vanta.clouds.min.js");
      const CLOUDS = mod.default || mod._vantaEffect || mod;
      if (disposed || !el || typeof CLOUDS !== "function") return;
      effect = CLOUDS({
        el,
        THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        skyColor: p.sky,
        cloudColor: p.cloud,
        cloudShadowColor: p.cloudShadow,
        sunColor: p.sun,
        sunGlareColor: p.sunGlare,
        sunlightColor: p.sunlight,
        speed: p.speed * SPEED,
      });

      // Cloud field scale: <1 pulls them closer (bigger, more obvious).
      const FAR = 0.85;
      const pushBack = () => {
        try {
          const r = effect && effect.uniforms && effect.uniforms.iResolution;
          if (r && r.value) {
            r.value.x = r.value.x / FAR;
            r.value.y = r.value.y / FAR;
          }
        } catch (e) {
          /* ignore */
        }
      };
      pushBack();
      if (typeof effect.resize === "function") {
        const origResize = effect.resize.bind(effect);
        effect.resize = () => {
          origResize();
          pushBack();
        };
      }
      applyPalette(true);
    } catch (e) {
      /* WebGL unavailable or load failed — CSS sky fallback remains */
    }
  });

  onCleanup(() => {
    disposed = true;
    try {
      if (effect) effect.destroy();
    } catch (e) {
      /* ignore */
    }
  });

  return (
    <div
      class="sky"
      ref={el}
      style={{
        background: `linear-gradient(180deg, ${p.bg[0]} 0%, ${p.bg[1]} 50%, ${p.bg[2]} 100%)`,
      }}
    />
  );
}
