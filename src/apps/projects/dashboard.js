import React, { useState } from "react";
import ClawdIcon from "../../assets/icons/apps/clawd.svg";
import { Pick, useCopy } from "./ui";

// Mock screens of the sprint dashboard: same layout as the real one, made-up
// tickets, files and merge requests.

const tag = "rounded px-1.5 py-px text-[9px] font-semibold";
const card = "rounded-md border border-[#2e313a] bg-[#1e2026]";

const Tabs = () => (
  <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap border-b border-[#2e313a] px-2 py-1.5 text-[11px]">
    {[
      ["orders-api", "bg-ink-muted", true],
      ["review !42", "bg-[#f5c451]", false, "needs you"],
      ["web", "bg-ink-muted"],
    ].map(([name, dot, on, badge]) => (
      <span
        key={name}
        className={`flex items-center gap-1.5 rounded-md px-2 py-1 ${on ? "bg-white/10 text-ink-text" : "text-ink-muted"}`}
      >
        <i className={`size-1.5 rounded-full ${dot}`} />
        {name}
        {badge && (
          <span className={`${tag} bg-[#f5c451]/20 text-[#f5c451]`}>
            {badge}
          </span>
        )}
      </span>
    ))}
    <span className="rounded-md border border-[#2e313a] px-1.5 text-ink-muted">
      +
    </span>
    <span className="ml-auto hidden text-[10px] text-ink-muted sm:inline">
      ⌥T terminal · ⌘K search
    </span>
  </div>
);

const Chat = () => (
  <div className="flex flex-col">
    <Tabs />
    <div className="flex flex-col gap-2.5 p-3 text-[11px] text-ink-text">
      <div className="self-end rounded-lg bg-white/10 px-2.5 py-1.5">
        Work the next backend ticket on the sprint
      </div>
      <div className="flex gap-2">
        <img src={ClawdIcon} alt="" className="size-5 flex-none" />
        <div className="flex min-w-0 flex-col gap-2">
          <p>
            <b>T-2</b> is next: it unblocks the search box. I added an{" "}
            <code className="rounded bg-white/10 px-1">export_format</code>{" "}
            column with a backfill, so old exports keep reading as CSV.
          </p>
          <div
            className={`${card} flex flex-wrap items-center gap-1.5 px-2 py-1 text-[10px] text-ink-muted`}
          >
            <span className="text-[#7fd1a8]">✓</span> Worked for{" "}
            <b className="text-ink-text">2m 5s</b>
            {["Read ×2", "Bash ×2", "Grep", "Edit"].map((t) => (
              <span key={t} className={`${tag} bg-white/10 font-normal`}>
                {t}
              </span>
            ))}
          </div>
          <div className={card}>
            <div className="flex items-center gap-2 border-b border-[#2e313a] px-2 py-1 text-[10px]">
              <b>Edited 2 files</b>
              <span className="text-ink-muted">src/orders</span>
              <span className="ml-auto text-[#7fd1a8]">+34</span>
              <span className="text-[#e5797a]">−1</span>
              <span className={`${tag} bg-white/10 font-normal`}>
                Review all
              </span>
            </div>
            {[
              ["models.py", "+3 −1"],
              ["0042_export_format.py", "+31 −0"],
            ].map(([f, d]) => (
              <div
                key={f}
                className="flex justify-between px-2 py-0.5 font-mono text-[10px] text-ink-muted"
              >
                <span className="text-ink-text">{f}</span>
                {d}
              </div>
            ))}
          </div>
          <div className={`${card} border-[#f5c451]/50 p-2`}>
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f5c451]">
              Claude wants to run
            </div>
            <code className="mt-1 block font-mono text-[10px]">
              pytest tests/orders -q
            </code>
            <div className="mt-1.5 flex flex-wrap gap-1.5 whitespace-nowrap">
              {[
                "Yes",
                "Yes, and don’t ask again",
                "No, and tell Claude why",
              ].map((c, i) => (
                <span
                  key={c}
                  className={`rounded-full px-2 py-0.5 text-[10px] ${i ? "border border-[#3a3f4c] text-ink-muted" : "bg-lilac/80 text-white"}`}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className={card}>
            <div className="border-b border-[#2e313a] px-2 py-1 text-[10px]">
              <b>Subagents</b>{" "}
              <span className="text-ink-muted">1 running · 1 done</span>
            </div>
            <div className="flex justify-between px-2 py-0.5 text-[10px] text-ink-muted">
              <span>
                <span className="text-lilac-text">◌</span> Review pass on !42
              </span>
              <span>6 steps · 2m</span>
            </div>
            <div className="flex justify-between px-2 py-0.5 text-[10px] text-ink-muted">
              <span>
                <span className="text-[#7fd1a8]">✓</span> Plan T-2
              </span>
              <span>9m</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-1 rounded-lg border border-[#3a3f4c] px-2.5 py-2 text-[10px] text-ink-muted">
        Message Claude…
        <div className="mt-1.5 font-mono">
          Opus · 34% context · feat/T-2-export-format · +41 −6
        </div>
      </div>
    </div>
  </div>
);

const Ring = ({ pct, label, sub }) => (
  <div className="flex flex-col items-center text-[10px]">
    <svg viewBox="0 0 36 36" className="size-11 -rotate-90">
      <circle
        cx="18"
        cy="18"
        r="15"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="3"
      />
      <circle
        cx="18"
        cy="18"
        r="15"
        fill="none"
        stroke="#b98ab9"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * 94.2} 94.2`}
      />
    </svg>
    <b className="text-ink-text">{label}</b>
    <span className="text-ink-muted">{sub}</span>
  </div>
);

const Ticket = ({ id, layer, status, tone, title, action, extra }) => (
  <div className={`${card} p-2`}>
    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
      <b className="text-lilac-text">{id}</b>
      <span
        className={`${tag} border border-[#3a3f4c] font-normal text-ink-muted`}
      >
        {layer}
      </span>
      <span className={`${tag} ${tone}`}>{status}</span>
      {extra}
    </div>
    <div className="mt-1 flex items-center gap-2 text-[11px] text-ink-text">
      <span className="flex-1">{title}</span>
      {action && (
        <span className="rounded border border-[#3a3f4c] px-1.5 py-0.5 text-[10px] text-ink-muted">
          ▷ {action}
        </span>
      )}
    </div>
  </div>
);

const Panel = () => (
  <div className="flex flex-col gap-2 p-3">
    <div className="flex gap-3 text-[10px] text-ink-muted">
      <b className="text-ink-text">⚑ Sprint</b>
      <span>To review 3</span>
      <span>My MRs 1</span>
      <span>My tasks</span>
      <span>Refine 4</span>
    </div>
    <div className={`${card} flex items-center gap-3 p-3`}>
      <div className="flex-1">
        <div className="text-[9px] uppercase tracking-[0.14em] text-ink-muted">
          Board · supervised
        </div>
        <div className="text-[15px] font-bold text-ink-text">Sprint 14</div>
        <div className="text-[10px] text-ink-muted">
          Updated 09:15 · driving backend
        </div>
      </div>
      <Ring pct={83} label="20/24" sub="BE" />
      <Ring pct={64} label="7/11" sub="FE" />
    </div>
    <div className="text-[10px] text-ink-muted">
      <span className="text-[#7fd1a8]">●</span>{" "}
      <b className="text-ink-text">Now:</b> CI for !42 (~4m)
    </div>
    <div className="rounded-md border border-lilac/60 bg-lilac/10 p-2.5">
      <div className="text-[9px] uppercase tracking-[0.14em] text-lilac-text">
        Needs you
      </div>
      <div className="text-[12px] font-semibold text-ink-text">
        Confirm the merge of !42
      </div>
      <div className="text-[10px] text-ink-muted">
        T-1 · CI green and approved; merges always ask
      </div>
      <span className="mt-1.5 inline-block rounded bg-lilac/80 px-2 py-0.5 text-[10px] font-semibold text-white">
        Open
      </span>
    </div>
    <div className="text-[9px] uppercase tracking-[0.14em] text-ink-muted">
      Actionable now · 2
    </div>
    <Ticket
      id="T-5"
      layer="BE"
      status="Ready"
      tone="bg-[#7fd1a8]/20 text-[#7fd1a8]"
      title="Orders API: bulk status update"
      action="implement"
      extra={
        <span className={`${tag} bg-white/10 font-normal text-ink-muted`}>
          Unblocks 2
        </span>
      }
    />
    <Ticket
      id="T-1"
      layer="BE"
      status="MR !42"
      tone="bg-lilac/20 text-lilac-text"
      title="Orders API: search endpoint"
      action="review-mr"
    />
    <div className="text-[9px] uppercase tracking-[0.14em] text-ink-muted">
      Waiting · 1
    </div>
    <Ticket
      id="T-3"
      layer="FE"
      status="Waiting on a dependency"
      tone="bg-[#f5c451]/20 text-[#f5c451]"
      title="Orders page: search box"
    />
  </div>
);

const DIFF = [
  [" ", "def search(query: str, page: int = 1):"],
  ["-", "    rows = db.orders.filter(name__icontains=query)"],
  ["+", "    rows = db.orders.filter(name__icontains=query.strip())"],
  ["+", '    rows = rows.order_by("-created_at")'],
  [" ", "    return paginate(rows, page, size=50)"],
];

const Review = () => (
  <div className="flex flex-col gap-2 p-3">
    <div className="flex flex-wrap items-center gap-2 text-[11px]">
      <b className="text-ink-text">!42 Orders API: search endpoint</b>
      <span className={`${tag} bg-[#7fd1a8]/20 text-[#7fd1a8]`}>approved</span>
      <span className={`${tag} bg-[#e5797a]/20 text-[#e5797a]`}>
        1 job failed
      </span>
      <span className="ml-auto text-[10px] text-ink-muted">
        thread 1 of 2 ‹ ›
      </span>
    </div>
    <div className={`${card} overflow-x-auto`}>
      <div className="border-b border-[#2e313a] px-2 py-1 font-mono text-[10px] text-ink-muted">
        src/orders/search.py
      </div>
      {DIFF.map(([s, l], i) => (
        <div
          key={i}
          className={`whitespace-pre px-2 font-mono text-[10px] leading-5 ${s === "+" ? "bg-[#7fd1a8]/10 text-[#c6efd9]" : s === "-" ? "bg-[#e5797a]/10 text-[#f2c4c4]" : "text-ink-muted"}`}
        >
          {s} {l}
        </div>
      ))}
      <div className="m-2 rounded border border-lilac/50 bg-lilac/10 p-2 text-[11px] text-ink-text">
        <div className="text-[9px] uppercase tracking-[0.14em] text-lilac-text">
          Proposed comment · line 4
        </div>
        Sorting by date makes paging unstable when two orders share a timestamp.
        Add the id as a tie-breaker?
        <div className="mt-1.5 flex gap-1.5 text-[10px]">
          <span className="rounded bg-lilac/80 px-2 py-0.5 font-semibold text-white">
            Post
          </span>
          <span className="rounded border border-[#3a3f4c] px-2 py-0.5 text-ink-muted">
            Edit
          </span>
          <span className="rounded border border-[#3a3f4c] px-2 py-0.5 text-ink-muted">
            Skip
          </span>
        </div>
      </div>
    </div>
    <div className={`${card} p-2 font-mono text-[10px] text-ink-muted`}>
      <div className="mb-1 font-sans text-[10px] text-[#e5797a]">
        ✕ openapi-contract
      </div>
      <div>breaking change: GET /orders/search</div>
      <div>&nbsp;&nbsp;removed query parameter &ldquo;q&rdquo;</div>
    </div>
  </div>
);

const SCREENS = { chat: Chat, sprint: Panel, review: Review };

// the screens are of an English-language tool, so only the frame is translated
const COPY = {
  en: {
    screens: ["Chat view", "Sprint panel", "MR review"],
    mock: "mock · made-up data",
  },
  es: {
    screens: ["Vista de chat", "Panel del sprint", "Revisión de MR"],
    mock: "maqueta · datos inventados",
  },
  ca: {
    screens: ["Vista de xat", "Panell del sprint", "Revisió de MR"],
    mock: "maqueta · dades inventades",
  },
};

const Dashboard = () => {
  const [view, setView] = useState("chat");
  const t = useCopy(COPY);
  const Screen = SCREENS[view];
  return (
    <figure className="rounded-lg border border-[#2e313a] bg-[#191b20] p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2 px-1 text-[11px] text-ink-muted">
        <Pick
          label=""
          options={Object.keys(SCREENS).map((k, i) => [k, t.screens[i]])}
          value={view}
          onChange={setView}
        />
        <span className="ml-auto">{t.mock}</span>
      </div>
      {/* a browser window around the screen */}
      <div className="overflow-hidden rounded-lg border border-[#2e313a] bg-[#15171c] shadow-[0_18px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 border-b border-[#2e313a] bg-[#1e2026] px-3 py-1.5">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <i
              key={c}
              className="size-2 rounded-full"
              style={{ background: c }}
            />
          ))}
          <span className="mx-auto rounded bg-white/5 px-3 font-mono text-[9px] text-ink-muted">
            localhost:4317
          </span>
        </div>
        <div className="min-h-[380px]">
          <Screen />
        </div>
      </div>
    </figure>
  );
};

export default Dashboard;
