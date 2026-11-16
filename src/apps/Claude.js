import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Window from "../components/Window";
import useTicker from "../hooks/useTicker";
import { RUNS } from "../data";
import { ask } from "./shell/commands";
import { animate, hello, sceneFor } from "./claude/clawd";
import Clawd from "./claude/ClawdCanvas";
import ClawdIcon from "../assets/icons/apps/clawd.svg";

// A Claude-desktop-style chat about David. Same scripted runs as the
// terminal's `claude`: no API calls, every answer is canned.
const STEP_MS = 1100;
const ORANGE = "#d97757";

const Avatar = () => (
  <img src={ClawdIcon} alt="" className="h-7 w-7 flex-none" />
);

// one answer: tool steps tick in as a small activity list, then the text
const Answer = ({ run }) => {
  const { t } = useTranslation();
  const steps = RUNS[run];
  const step = useTicker(steps.length, STEP_MS);
  const done = step >= steps.length;
  const n = useRef(0); // read by the canvas loop each frame
  n.current = step;
  const lines = t(`desktop.terminal.runs.${run}.answer`, {
    returnObjects: true,
  });
  return (
    <div className="flex gap-3">
      {done ? (
        <Avatar />
      ) : (
        // the dashboard's working Clawd: a lens for Read/Grep, a screen for
        // Bash, the "?" while he plans. Starting 4s back skips his intro.
        <Clawd
          className="h-[34px] w-12 flex-none"
          draw={(c) =>
            animate(c, Date.now() - 4000, () =>
              n.current < steps.length
                ? sceneFor(steps[n.current].tool) || "think"
                : "think",
            )
          }
        />
      )}
      <div className="min-w-0 flex-1">
        <ul className="mb-2 space-y-0.5 text-[12.5px] text-[#87867f]">
          {steps.slice(0, step + 1).map((s, i) => (
            <li
              key={s.tool + s.arg}
              className={`truncate font-mono ${i === step ? "animate-pulse" : ""}`}
            >
              {s.tool} <span className="text-[#b0aea5]">{s.arg}</span>
              {i < step && ` · ${s.result}`}
            </li>
          ))}
        </ul>
        {done && (
          <div className="font-serif text-[15.5px] leading-[1.6] text-[#3d3929]">
            {lines.map((l, i) =>
              l.startsWith("-") ? (
                <div key={i} className="flex gap-2 pl-1">
                  <span>•</span>
                  <span>{l.slice(1).trim()}</span>
                </div>
              ) : (
                <p key={i} className={l ? "mb-1" : "h-3"}>
                  {l}
                </p>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Fallback = () => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-3">
      <Avatar />
      <div className="font-serif text-[15.5px] leading-[1.6] text-[#3d3929]">
        <p className="mb-1">{t("desktop.terminal.fallback")}</p>
        {Object.keys(RUNS).map((id) => (
          <div key={id} className="flex gap-2 pl-1">
            <span>•</span>
            {t(`desktop.terminal.runs.${id}.label`)}
          </div>
        ))}
      </div>
    </div>
  );
};

const Claude = ({ win }) => {
  const { t } = useTranslation();
  const [chats, setChats] = useState([]); // [{ id, msgs: [{ q, run }] }]
  const [cur, setCur] = useState(null); // id of the open chat, null = new
  const [text, setText] = useState("");
  const input = useRef(null);
  const chat = chats.find((c) => c.id === cur);
  const label = (id) => t(`desktop.terminal.runs.${id}.label`);

  const send = (q, run = ask(q)) => {
    const msg = { id: Date.now(), q, run };
    if (chat) {
      setChats((cs) =>
        cs.map((c) => (c.id === cur ? { ...c, msgs: [...c.msgs, msg] } : c)),
      );
    } else {
      setChats((cs) => [{ id: msg.id, msgs: [msg] }, ...cs]);
      setCur(msg.id);
    }
    setText("");
    input.current?.focus();
  };
  const submit = (e) => {
    e.preventDefault();
    if (text.trim()) send(text.trim());
  };

  const composer = (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-[#e5e2d8] bg-white px-4 pb-2.5 pt-3 shadow-[0_2px_12px_rgba(60,50,30,0.06)] focus-within:border-[#d4d0c4]"
    >
      <textarea
        ref={input}
        autoFocus={!win.phone}
        rows={chat ? 1 : 2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) submit(e);
        }}
        aria-label={t("desktop.claude.placeholder")}
        placeholder={t("desktop.claude.placeholder")}
        className="w-full resize-none bg-transparent text-[15px] text-[#3d3929] outline-none placeholder:text-[#a3a198]"
      />
      <div className="mt-1 flex items-center justify-between">
        <span className="text-[12px] text-[#87867f]">David 1.0</span>
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label={t("desktop.claude.send")}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white disabled:opacity-40"
          style={{ background: ORANGE }}
        >
          <span aria-hidden="true" className="text-[17px] font-bold">
            ↑
          </span>
        </button>
      </div>
    </form>
  );

  return (
    <Window
      {...win}
      label={t("desktop.apps.claude")}
      title="Claude"
      rect={{ w: 860, h: 560 }}
      className="border border-[#d9d5c9] bg-[#faf9f5] font-sans text-[#3d3929]"
      barClassName="h-[30px] bg-[#f0eee6]"
    >
      <div className="flex min-h-0 flex-1">
        {/* sidebar: new chat + this visit's chats */}
        {!win.phone && (
          <aside className="flex w-[210px] flex-none flex-col gap-1 border-r border-[#e5e2d8] bg-[#f0eee6] p-2.5 text-[13.5px]">
            <button
              type="button"
              onClick={() => {
                setCur(null);
                input.current?.focus();
              }}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 font-medium hover:bg-[#e5e2d8]"
            >
              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                className="h-5 w-5 flex-none"
              >
                <circle cx="10" cy="10" r="10" fill={ORANGE} />
                <path
                  d="M10 5.5v9M5.5 10h9"
                  stroke="#fff"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              {t("desktop.claude.newChat")}
            </button>
            {chats.length > 0 && (
              <div className="mt-3 px-2 text-[11.5px] font-medium text-[#87867f]">
                {t("desktop.claude.recents")}
              </div>
            )}
            {chats.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCur(c.id)}
                aria-current={c.id === cur}
                className={`truncate rounded-lg px-2 py-1.5 text-left ${c.id === cur ? "bg-[#e5e2d8]" : "hover:bg-[#e8e5dc]"}`}
              >
                {c.msgs[0].q}
              </button>
            ))}
          </aside>
        )}

        {chat ? (
          <div className="flex min-w-0 flex-1 flex-col">
            {/* reversed column keeps the newest message in view */}
            <div className="flex min-h-0 flex-1 flex-col-reverse overflow-auto px-6 py-5">
              <div className="mx-auto w-full max-w-[620px] space-y-5">
                {chat.msgs.map((m) => (
                  <React.Fragment key={m.id}>
                    <div className="flex items-start gap-2.5 rounded-xl bg-[#f0eee6] px-3 py-2.5">
                      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#3d3929] text-[11px] font-semibold text-white">
                        {t("desktop.claude.you").charAt(0)}
                      </span>
                      <span className="pt-0.5 text-[15px]">{m.q}</span>
                    </div>
                    {m.run ? <Answer run={m.run} /> : <Fallback />}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="mx-auto w-full max-w-[668px] px-6 pb-4">
              {composer}
              <p className="mt-2 text-center text-[11.5px] text-[#a3a198]">
                {t("desktop.claude.disclaimer")}
              </p>
            </div>
          </div>
        ) : (
          // new chat: greeting, composer, suggestions
          <div className="hero flex min-w-0 flex-1 flex-col items-center justify-center overflow-auto px-6 py-8">
            {/* drops in, waves, then looks at the suggestion you hover */}
            <Clawd draw={hello} className="h-[70px] w-[110px]" />
            <h2 className="mb-6 mt-3 text-center font-serif text-[30px] text-[#3d3929]">
              {t("desktop.claude.greeting")}
            </h2>
            <div className="w-full max-w-[620px]">
              {composer}
              <div className="starts mt-3 flex flex-wrap justify-center gap-2">
                {Object.keys(RUNS).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => send(label(id), id)}
                    className="rounded-lg border border-[#e5e2d8] bg-[#faf9f5] px-3 py-1.5 text-[13px] text-[#5e5d59] hover:bg-[#f0eee6]"
                  >
                    {label(id)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Window>
  );
};

export default Claude;
