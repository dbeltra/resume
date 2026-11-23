import React from "react";
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
    <figure className="overflow-hidden rounded-lg border border-[#2e313a] bg-ink-850">
      <figcaption className="border-b border-[#2e313a] px-4 py-2 text-[11px] text-ink-muted">
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
  <h3 className="mb-2 mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-text">
    {children}
  </h3>
);

export const Edge = ({ d, label, x, y, dashed, anchor = "middle" }) => (
  <>
    <path
      d={d}
      fill="none"
      stroke="#4a4f5c"
      strokeWidth="1.5"
      strokeDasharray={dashed ? "4 4" : undefined}
      markerEnd="url(#arrow)"
    />
    {label && (
      <text
        x={x}
        y={y}
        textAnchor={anchor}
        className="fill-ink-muted text-[11px]"
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
      <path d="M0 0 L8 4 L0 8 z" fill="#4a4f5c" />
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
      fill="#262932"
      stroke={accent ? "#b98ab9" : "#3a3f4c"}
      strokeWidth={accent ? 2 : 1}
    />
    <text
      x={x + w / 2}
      y={y + h / 2 - 3}
      textAnchor="middle"
      className="fill-ink-text text-[13px] font-semibold"
    >
      {label}
    </text>
    <text
      x={x + w / 2}
      y={y + h / 2 + 13}
      textAnchor="middle"
      className="fill-ink-muted text-[10px]"
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
        className={`rounded-full px-2.5 py-0.5 font-semibold ${value === v ? "bg-white/15 text-ink-text" : "hover:bg-white/5"}`}
      >
        {text}
      </button>
    ))}
  </>
);

// kicker, title, pitch and stack chips at the top of a case study
export const Intro = ({ kicker, title, pitch, stack }) => (
  <>
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-lilac-text">
      {kicker}
    </p>
    <h2 className="mt-1 text-[26px] font-semibold leading-tight text-white">
      {title}
    </h2>
    <p className="mt-2 text-[16px] text-ink-text">{pitch}</p>
    <ul className="mt-4 flex flex-wrap gap-1.5">
      {stack.map((s) => (
        <li
          key={s}
          className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-ink-text"
        >
          {s}
        </li>
      ))}
    </ul>
  </>
);

export const Article = ({ children }) => (
  <article className="mx-auto max-w-[720px] px-6 pb-10 pt-6 text-[14px] leading-relaxed text-[#c3c7d0]">
    {children}
  </article>
);

// a rounded button for the mocks’ replies and actions
export const Chip = (props) => (
  <button
    type="button"
    className="rounded-full border border-[#3a3f4c] px-3 py-1 text-[12px] font-semibold text-ink-text hover:bg-white/10"
    {...props}
  />
);

// "What I built" style lists: [bold lead-in, rest of the sentence]
export const Bullets = ({ items, className = "" }) => (
  <ul
    className={`list-disc space-y-1.5 pl-5 marker:text-ink-muted ${className}`}
  >
    {items.map(([lead, text]) => (
      <li key={lead}>
        <b className="text-ink-text">{lead}</b> {text}
      </li>
    ))}
  </ul>
);
