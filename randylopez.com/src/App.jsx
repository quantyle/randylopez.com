import { createSignal, createEffect, onMount, onCleanup, Show, For } from "solid-js";
import { setScale, setBooted, setScreen } from "./store.js";
import { profile } from "./data/portfolio.js";
import { AppleRainbow, AppleMono } from "./components/Icons.jsx";
import BootSequence from "./components/BootSequence.jsx";
import SkyBackground from "./components/SkyBackground.jsx";
import Desktop from "./components/Desktop.jsx";

const BODY_W = 748;
const BODY_H = 614;
const BODY_H_SM = 710;

const SHELL_LINES = [
  "PearBIOS v2.4 \u2014 POST ok",
  "booting pear/os \u2026",
  "[  ok  ] mounted /dev/floppy0",
  "[  ok  ] started display manager",
  "[  ok  ] loaded portfolio modules",
  "[  ok  ] net: randylopez.com is up",
  "starting desktop environment \u2026",
];

export default function App() {
  const atHome =
    typeof window !== "undefined" && window.location.pathname === "/home";
  const [mode, setMode] = createSignal(atHome ? "active" : "intro");
  const [zooming, setZooming] = createSignal(false);

  const [tube, setTube] = createSignal(atHome ? "on" : "off");
  const [booting, setBooting] = createSignal(false);

  const [introReady, setIntroReady] = createSignal(false);
  const [bootCount, setBootCount] = createSignal(0);
  let introTimers = [];

  const [fitScale, setFitScale] = createSignal(initialFit());
  const [appH, setAppH] = createSignal(initialH());
  const [tiltX, setTiltX] = createSignal("0deg");
  const [tiltY, setTiltY] = createSignal("0deg");

  const mq = (q) =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia(q).matches
      : false;
  const reduceMotion = mq("(prefers-reduced-motion: reduce)");
  const tiltEnabled = !reduceMotion && !mq("(pointer: coarse)");

  function viewport() {
    const vv = window.visualViewport;
    return {
      w: (vv && vv.width) || window.innerWidth,
      h: (vv && vv.height) || window.innerHeight,
    };
  }

  function computeFit(w, h) {
    const small = Math.min(w, h) < 620;
    const narrow = w < 600;
    const bodyH = narrow ? BODY_H_SM : BODY_H;
    const marginW = small ? 0.93 : 0.95;
    const marginH = small ? 0.97 : 0.94;
    const reserveBottom = small ? 16 : 30;
    const s = Math.min(
      (w * marginW) / BODY_W,
      ((h - reserveBottom) * marginH) / bodyH
    );
    return Math.max(0.26, Math.min(2.2, s));
  }

  function initialFit() {
    if (typeof window === "undefined") return 1;
    const vv = window.visualViewport;
    const w = (vv && vv.width) || window.innerWidth;
    const h = (vv && vv.height) || window.innerHeight;
    const small = Math.min(w, h) < 620;
    const narrow = w < 600;
    const bodyH = narrow ? BODY_H_SM : BODY_H;
    const s = Math.min(
      (w * (small ? 0.93 : 0.95)) / BODY_W,
      ((h - (small ? 16 : 30)) * (small ? 0.97 : 0.94)) / bodyH
    );
    return Math.max(0.26, Math.min(2.2, s));
  }
  function initialH() {
    if (typeof window === "undefined") return "100%";
    const vv = window.visualViewport;
    return ((vv && vv.height) || window.innerHeight) + "px";
  }

  function recompute() {
    const { w, h } = viewport();
    setAppH(h + "px");
    if (mode() === "active") {
      setScreen(w, h);
      setScale(1);
    } else {
      const s = computeFit(w, h);
      setFitScale(s);
      setScale(s);
    }
  }

  function animateToDesktop() {
    if (zooming() || mode() === "active") return;
    if (reduceMotion) {
      enterActive();
      return;
    }
    setZooming(true);
    setTimeout(enterActive, 600);
  }

  function start() {
    if (zooming() || mode() === "active") return;
    window.history.pushState({ page: "home" }, "", "/home");
    animateToDesktop();
  }

  function enterActive() {
    setMode("active");
    setZooming(false);
    recompute();
    setTube("on");
    setBooting(true);
  }

  function bootDone() {
    setBooting(false);
    setBooted(true);
  }

  function restart() {
    setTube("off");
    setTimeout(
      () => {
        setBooted(false);
        setTube("on");
        setBooting(true);
      },
      reduceMotion ? 80 : 520
    );
  }

  function animateToIntro() {
    if (mode() !== "active") return;
    setTube("off");
    setTimeout(
      () => {
        setBooted(false);
        setBooting(false);
        setTube("off");
        setMode("intro");
        recompute();
      },
      reduceMotion ? 80 : 520
    );
  }

  function shutDown() {
    if (mode() !== "active") return;
    window.history.pushState({ page: "root" }, "", "/");
    animateToIntro();
  }

  function onPointerMove(e) {
    if (!tiltEnabled || mode() !== "intro" || zooming()) return;
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    const max = 2.6;
    setTiltX((-dy * max).toFixed(2) + "deg");
    setTiltY((dx * max).toFixed(2) + "deg");
  }
  function resetTilt() {
    setTiltX("0deg");
    setTiltY("0deg");
  }

  function startIntroBoot() {
    introTimers.forEach(clearTimeout);
    introTimers = [];
    if (reduceMotion) {
      setBootCount(SHELL_LINES.length);
      setIntroReady(true);
      return;
    }
    setIntroReady(false);
    setBootCount(0);
    SHELL_LINES.forEach((_, i) => {
      introTimers.push(setTimeout(() => setBootCount(i + 1), 140 + i * 150));
    });
    introTimers.push(
      setTimeout(() => setIntroReady(true), 140 + SHELL_LINES.length * 150 + 360)
    );
  }

  createEffect(() => {
    if (mode() === "intro") startIntroBoot();
  });

  onMount(() => {
    recompute();

    if (window.location.pathname === "/home" && mode() === "active") {
      setTube("on");
      setBooted(true);
      recompute();
    }

    const onPop = () => {
      const p = window.location.pathname;
      if (p === "/home") {
        if (mode() !== "active") animateToDesktop();
      } else if (mode() === "active") {
        animateToIntro();
      }
    };
    window.addEventListener("popstate", onPop);

    const onResize = () => recompute();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", onResize);
      vv.addEventListener("scroll", onResize);
    }
    onCleanup(() => {
      introTimers.forEach(clearTimeout);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (vv) {
        vv.removeEventListener("resize", onResize);
        vv.removeEventListener("scroll", onResize);
      }
    });
  });

  return (
    <>
      <SkyBackground mode={mode()} />
      <Show when={mode() === "intro"}>
        <div
          class="room"
          style={{ height: appH() }}
          onPointerMove={onPointerMove}
          onPointerLeave={resetTilt}
        >
          <div class="stage" classList={{ zooming: zooming() }}>
            <div class="tilt" style={{ "--tiltX": tiltX(), "--tiltY": tiltY() }}>
              <div class="monitor">
                <div class="screen-surround">
                  <div class="screen-frame">
                    <div class="glass">
                      <div class="viewport intro-viewport screen-on">
                        <div
                          class="intro-screen"
                          onClick={() => {
                            if (introReady()) start();
                            else setIntroReady(true);
                          }}
                        >
                          <Show
                            when={introReady()}
                            fallback={
                              <div class="boot-log">
                                <For each={SHELL_LINES.slice(0, bootCount())}>
                                  {(l) => <div class="boot-line">{l}</div>}
                                </For>
                                <div class="boot-line">
                                  <span class="boot-cursor">█</span>
                                </div>
                              </div>
                            }
                          >
                            <AppleRainbow class="intro-logo" />
                            <div class="intro-title">{profile.name}</div>
                            <div class="intro-sub">Software Engineer</div>
                            <button
                              class="start-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                start();
                              }}
                            >
                              Start
                            </button>
                          </Show>
                        </div>
                      </div>
                      <div class="crt-vignette" />
                      <div class="crt-scanlines" />
                      <div class="crt-phosphor" />
                      <div class="crt-glare" />
                    </div>
                  </div>
                </div>
                <div class="monitor-brand">
                  <AppleMono class="brand-logo" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>

      <Show when={mode() === "active"}>
        <div class="fullscreen" style={{ height: appH() }}>
          <div class="glass full">
            <div class={`tube ${tube()}`}>
              <div class="viewport">
                <Show
                  when={!booting()}
                  fallback={<BootSequence onDone={bootDone} />}
                >
                  <Desktop onRestart={restart} onShutDown={shutDown} />
                </Show>
              </div>
            </div>

            <div class="crt-vignette" />
            <div class="crt-scanlines" />
            <div class="crt-phosphor" />
          </div>
        </div>
      </Show>
    </>
  );
}
