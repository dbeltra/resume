import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { highlightLines } from "../Code";

// Shared pieces of the case studies: headings, code snippets and the
// boxes and arrows of their SVG diagrams.

// The case studies' text in each language: pages keep a { en, es, ca } object
// of their copy and read the visitor's language from it, English as fallback.
export const useCopy = (copy) => {
  const { i18n } = useTranslation();
  return copy[i18n.resolvedLanguage] || copy.en;
};

const REWRITTEN = {
  en: "simplified, rewritten for this page",
  es: "simplificado, reescrito para esta página",
  ca: "simplificat, reescrit per a aquesta pàgina",
};

// a code snippet; `file` gets the "rewritten for this page" note added
export const Snippet = ({ caption, file, code, language }) => {
  const rewritten = useCopy(REWRITTEN);
  return (
    <figure className="p-dark overflow-hidden rounded-lg border border-p-line bg-p-sunk">
      <figcaption className="border-b border-p-line px-4 py-2 text-[11px] text-p-muted">
        {caption || `${file} · ${rewritten}`}
      </figcaption>
      <pre className="overflow-x-auto px-4 py-3 text-[12px] leading-[1.6]">
        <code
          className="hljs !whitespace-pre !bg-transparent !p-0"
          dangerouslySetInnerHTML={{
            __html: highlightLines(code, language).join("\n"),
          }}
        />
      </pre>
    </figure>
  );
};

export const H = ({ children }) => (
  <h3 className="case-h mb-2 mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-p-fg">
    {children}
  </h3>
);

export const Edge = ({ d, label, x, y, dashed, anchor = "middle" }) => (
  <>
    <path
      d={d}
      fill="none"
      stroke="rgb(var(--p-line3))"
      strokeWidth="1.5"
      strokeDasharray={dashed ? "4 4" : undefined}
      markerEnd="url(#arrow)"
    />
    {/* dashes travelling along the line, the data moving; css in index.css */}
    <path d={d} fill="none" className="flow" />
    {label && (
      <text
        x={x}
        y={y}
        textAnchor={anchor}
        className="fill-p-muted text-[11px]"
      >
        {label}
      </text>
    )}
  </>
);

// one marker per diagram; only one case study is on screen at a time
export const ArrowDefs = () => (
  <defs>
    <marker
      id="arrow"
      viewBox="0 0 8 8"
      refX="7"
      refY="4"
      markerWidth="7"
      markerHeight="7"
      orient="auto-start-reverse"
    >
      <path d="M0 0 L8 4 L0 8 z" fill="rgb(var(--p-line3))" />
    </marker>
  </defs>
);

export const Box = ({ x, y, w, h = 48, label, sub, accent }) => (
  <g>
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx="10"
      fill="rgb(var(--p-raised))"
      stroke={accent ? "rgb(var(--p-pop))" : "rgb(var(--p-line2))"}
      strokeWidth={accent ? 2 : 1}
    />
    <text
      x={x + w / 2}
      y={y + h / 2 - 3}
      textAnchor="middle"
      className="fill-p-fg text-[13px] font-semibold"
    >
      {label}
    </text>
    <text
      x={x + w / 2}
      y={y + h / 2 + 13}
      textAnchor="middle"
      className="fill-p-muted text-[10px]"
    >
      {sub}
    </text>
  </g>
);

// pill buttons that pick one option, e.g. the scanners' verdict
export const Pick = ({ label, options, value, onChange }) => (
  <>
    <span>{label}</span>
    {options.map(([v, text = v]) => (
      <button
        key={v}
        type="button"
        aria-pressed={value === v}
        onClick={() => onChange(v)}
        className={`rounded-full px-2.5 py-0.5 font-semibold ${value === v ? "bg-p-fg/15 text-p-fg" : "hover:bg-p-fg/5"}`}
      >
        {text}
      </button>
    ))}
  </>
);

// p≡p is always lower case, even inside uppercase labels
export const brand = (s) =>
  s.split("p≡p").flatMap((part, i) =>
    i
      ? [
          <span key={i} className="normal-case">
            p≡p
          </span>,
          part,
        ]
      : [part],
  );

// kicker, title, pitch and stack chips at the top of a case
// study; the colour is the company's, set as --accent by the Projects window
export const Intro = ({ kicker, title, pitch, stack }) => (
  <>
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:color-mix(in_srgb,var(--accent,#c49bc4)_80%,rgb(var(--p-fg)))]">
      {brand(kicker)}
    </p>
    <h2 className="mt-1 text-[30px] font-semibold leading-tight text-p-fg">
      {title}
    </h2>
    <p className="mt-2 text-[16px] text-p-fg">{pitch}</p>
    <ul className="mt-4 flex flex-wrap gap-1.5">
      {stack.map((s) => (
        <li
          key={s}
          className="rounded-full bg-p-fg/10 px-2 py-0.5 text-[11px] text-p-fg"
        >
          {s}
        </li>
      ))}
    </ul>
  </>
);

export const Article = ({ children }) => (
  <article className="mx-auto max-w-[720px] px-6 pb-10 pt-6 text-[14px] leading-relaxed text-p-body">
    {children}
  </article>
);

// a rounded button for the mocks’ replies and actions
export const Chip = (props) => (
  <button
    type="button"
    className="rounded-full border border-p-line2 px-3 py-1 text-[12px] font-semibold text-p-fg hover:bg-p-fg/10"
    {...props}
  />
);

// a few paragraphs from a copy array
export const Prose = ({ items }) =>
  items.map((x) => (
    <p key={x} className="mb-3">
      {x}
    </p>
  ));

// a plain bulleted list of sentences
export const Bullets = ({ items, className = "" }) => (
  <ul className={`list-disc space-y-1.5 pl-5 marker:text-p-muted ${className}`}>
    {items.map((it) => (
      <li key={it}>{it}</li>
    ))}
  </ul>
);

// real screenshots, side by side, scrolling sideways when they don't fit:
// [[image, caption, link?], ...]. Phone frames by default; `wide` for pages
// shot in a desktop browser.
// The row slides sideways as the page scrolls past it: it starts as it comes
// up from the bottom and reaches its last shot as it nears the top, so the
// page never stops scrolling. Dragging or swiping the row still works.
const useScrollLinked = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const page = el.closest(".proj") || window;
    // fade the right edge while there's more to see
    const fade = () =>
      (el.dataset.more = el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      const top = page.getBoundingClientRect?.().top ?? 0;
      const h = page.clientHeight ?? window.innerHeight;
      const y = (el.getBoundingClientRect().top - top) / h; // 1 = bottom edge
      const t = Math.min(1, Math.max(0, (0.85 - y) / 0.6)); // 85% → 25%
      if (max > 0) el.scrollLeft = t * max;
      fade();
    };
    update();
    page.addEventListener("scroll", update, { passive: true });
    el.addEventListener("scroll", fade, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      page.removeEventListener("scroll", update);
      el.removeEventListener("scroll", fade);
      window.removeEventListener("resize", update);
    };
  }, []);
  return ref;
};

export const Shots = ({ items, wide }) => {
  const ref = useScrollLinked();
  return (
    <div
      ref={ref}
      className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 pt-1 data-[more=true]:[mask-image:linear-gradient(to_right,#000_calc(100%_-_96px),transparent)]"
    >
      {items.map(([src, caption, href]) => (
        <figure
          key={src}
          className={`${wide ? "w-[300px]" : "w-[170px]"} flex-none snap-start`}
        >
          <img
            src={src}
            alt={caption}
            loading="lazy"
            className={`w-full bg-p-sunk object-cover object-top shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.1)] ${wide ? "aspect-[16/10] rounded-md border border-p-line" : "aspect-[390/844] rounded-[18px] border-[3px] border-p-line"}`}
          />
          <figcaption className="mt-3 text-[11px] leading-snug text-p-muted">
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-p-fg/20 underline-offset-2 hover:text-p-fg"
              >
                {caption} ↗
              </a>
            ) : (
              caption
            )}
          </figcaption>
        </figure>
      ))}
    </div>
  );
};

// one screenshot at a time, with arrows and dots
export const Carousel = ({ shots, caps }) => {
  const [i, setI] = useState(0);
  const go = (d) => setI((i + d + shots.length) % shots.length);
  const arrow =
    "absolute top-1/2 -translate-y-1/2 rounded-full bg-black/55 px-2.5 py-1 text-[16px] text-white transition-colors hover:bg-black/75";
  return (
    <figure>
      <div className="relative">
        <div className="overflow-hidden rounded-lg border border-p-line shadow-[0_1px_3px_rgba(0,0,0,0.08),0_6px_16px_rgba(0,0,0,0.1)]">
          <div
            style={{ transform: `translateX(-${i * 100}%)` }}
            className="flex transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none"
          >
            {shots.map((src, k) => (
              <img
                key={src}
                src={src}
                alt={caps[k]}
                aria-hidden={k !== i}
                className={`aspect-[14/9] w-full flex-none object-cover transition-opacity duration-700 ${k === i ? "" : "opacity-40"}`}
              />
            ))}
          </div>
        </div>
        {shots.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous"
              onClick={() => go(-1)}
              className={`${arrow} left-2`}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={() => go(1)}
              className={`${arrow} right-2`}
            >
              ›
            </button>
          </>
        )}
      </div>
      <figcaption className="mt-2 flex items-start gap-3 text-[11px] leading-snug text-p-muted">
        <span
          key={i}
          className="flex-1 motion-safe:animate-[case-rise_0.5s_cubic-bezier(0.165,0.84,0.44,1)_both]"
        >
          {caps[i]}
        </span>
        {shots.length > 1 && (
          <span className="flex flex-none gap-1.5 pt-1">
            {shots.map((src, k) => (
              <button
                key={src}
                type="button"
                aria-label={`${k + 1}`}
                aria-current={k === i}
                onClick={() => setI(k)}
                className={`h-2 rounded-full transition-all duration-500 ${k === i ? "w-5 bg-p-fg" : "w-2 bg-p-fg/25 hover:bg-p-fg/50"}`}
              />
            ))}
          </span>
        )}
      </figcaption>
    </figure>
  );
};
