import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import {
  profile,
  about,
  projects,
  languages,
  experience,
  education,
  contact,
} from "../data/portfolio.js";
import { openWindow, getEffectiveDate } from "../store.js";
import {
  AppleMono,
  FolderIcon,
  GithubLogo,
  LinkedinLogo,
  MailIcon,
  StudioIcon,
} from "./Icons.jsx";

export function StudioApp() {
  const studioUrl = import.meta.env.DEV
    ? "http://localhost:5174/"
    : "https://randylopez.studio";
  return (
    <div class="app studio-launch">
      <StudioIcon class="studio-logo" />
      <div class="studio-name">randylopez.studio</div>
      <div class="studio-sub">digital sound studio</div>
      <a
        class="btn launch-btn"
        href={studioUrl}
        target="_blank"
        rel="noreferrer"
      >
        Launch Studio
      </a>
    </div>
  );
}

function mdInline(s) {
  s = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  s = s.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a class="md-link" target="_blank" rel="noreferrer" href="$2">$1</a>'
  );
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return s;
}

function mdToHtml(md) {
  return md
    .trim()
    .split(/\n{2,}/)
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      if (block.startsWith("## ")) return `<h2>${mdInline(block.slice(3))}</h2>`;
      if (block.startsWith("# ")) return `<h1>${mdInline(block.slice(2))}</h1>`;
      const lines = block.split("\n").map((l) => mdInline(l));
      return `<p>${lines.join("<br>")}</p>`;
    })
    .join("");
}

export function AboutApp() {
  const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const roleLine = (e) =>
    `<p class="role-line"><strong>${esc(e.role)}</strong>` +
    `<span class="role-org">${esc(e.org)}</span>` +
    `<span class="role-date">${esc(e.period)}</span></p>`;

  const html =
    `<h1 class="note-title">${esc(profile.name)}</h1>` +
    `<p class="note-subtitle">${esc(profile.title)} · ${esc(profile.location)}</p>` +
    about.paragraphs.map((p) => mdToHtml(p)).join("") +
    mdToHtml("## Experience") +
    experience.map(roleLine).join("") +
    mdToHtml("## Education") +
    education.map(roleLine).join("") +
    mdToHtml("## Programming Languages") +
    mdToHtml(languages.join("; ")) +
    mdToHtml("## Projects") +
    [...projects]
      .sort((a, b) => b.stars - a.stars)
      .map((p) => mdToHtml(`[**${p.name}** ★ ${p.stars}](${p.link})`))
      .join("");

  return <div class="app note-paper md-note" innerHTML={html} />;
}

export function ContactApp() {
  const find = (name) =>
    (contact.links.find((l) => l[0] === name) || [])[2] || "#";
  return (
    <div class="app contact-paper">
      <h1>Get in touch</h1>
      <div class="contact-buttons">
        <a
          class="btn contact-btn"
          href={find("GitHub")}
          target="_blank"
          rel="noreferrer"
        >
          <GithubLogo class="contact-logo" />
          GitHub
        </a>
        <a
          class="btn contact-btn"
          href={find("LinkedIn")}
          target="_blank"
          rel="noreferrer"
        >
          <LinkedinLogo class="contact-logo" />
          LinkedIn
        </a>
        <a class="btn contact-btn" href={`mailto:${contact.email}`}>
          <MailIcon class="contact-logo" />
          Email
        </a>
      </div>
    </div>
  );
}

export function FinderApp() {
  const all = [
    { id: "about", label: "About", Icon: FolderIcon },
    { id: "contact", label: "Contact", Icon: MailIcon },
    { id: "studio", label: "Studio", Icon: StudioIcon },
  ];
  const [sel, setSel] = createSignal(null);
  const [q, setQ] = createSignal("");
  const items = () =>
    all.filter((it) =>
      it.label.toLowerCase().includes(q().trim().toLowerCase())
    );
  return (
    <div class="finder light-finder" onClick={() => setSel(null)}>
      <div class="finder-search" onClick={(e) => e.stopPropagation()}>
        <input
          class="finder-input"
          type="text"
          placeholder="Search"
          value={q()}
          onInput={(e) => setQ(e.currentTarget.value)}
        />
      </div>
      <div class="finder-bar">{items().length} items</div>
      <div class="finder-grid">
        <For each={items()}>
          {(it) => (
            <button
              class={`finder-item ${sel() === it.id ? "selected" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setSel(it.id);
                openWindow(it.id);
              }}
              onDblClick={(e) => {
                e.stopPropagation();
                openWindow(it.id);
              }}
            >
              <span class="finder-glyph">
                <it.Icon class="finder-ico" />
              </span>
              <span class="finder-label">{it.label}</span>
            </button>
          )}
        </For>
      </div>
    </div>
  );
}

export function AboutThisMac() {
  return (
    <div class="about-mac">
      <div class="big-apple">
        <AppleMono class="" />
      </div>
      <div class="sys">Developer Portfolio</div>
      <div class="role">
        {profile.name} — {profile.title}
      </div>
      <div class="mem">
        <b>System</b>
        <span>7.0.1</span>
        <b>Owner</b>
        <span>{profile.name}</span>
        <b>Built with</b>
        <span>SolidJS + Vite</span>
        <b>Total Memory</b>
        <span>4,096 K</span>
        <b>Largest Unused</b>
        <span>1,984 K</span>
      </div>
      <p class="footnote" style={{ "margin-top": "12px" }}>
        “{profile.tagline}”
      </p>
    </div>
  );
}

export function ClockApp() {
  const [now, setNow] = createSignal(Date.now());
  onMount(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    onCleanup(() => clearInterval(t));
  });

  const eff = () => {
    now(); // tick dependency so the readout advances
    return getEffectiveDate();
  };
  const hourLabel = () => (eff().getHours() % 12 || 12).toString();
  const minLabel = () => eff().getMinutes().toString().padStart(2, "0");
  const meridiem = () => (eff().getHours() >= 12 ? "PM" : "AM");
  const dateLabel = () =>
    eff().toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div class="clockset">
      <div class="clock-readout">
        <span class="clock-big">
          {hourLabel()}
          <span class="clock-colon">:</span>
          {minLabel()}
        </span>
        <span class="clock-ampm">{meridiem()}</span>
      </div>
      <div class="clock-status">{dateLabel()}</div>
    </div>
  );
}
