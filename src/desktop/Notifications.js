import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AppTile from "../components/AppTile";

// A few fake notifications from the desktop's own apps, once per visit.
// ponytail: fixed schedule; sessionStorage keeps reloads from replaying them.
const SCHEDULE = [
  { id: "mail", app: "mail", at: 15000 },
  { id: "term", app: "term", at: 60000 },
  { id: "agents", app: "code", at: 120000 },
];
const SHOW_MS = 8000;
const KEY = "notified";

const seen = () => {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

const Notifications = ({ onOpen }) => {
  const { t } = useTranslation();
  const [now, setNow] = useState(null);

  useEffect(() => {
    if (seen()) return;
    const timers = SCHEDULE.map((n, k) =>
      setTimeout(() => {
        setNow(n);
        if (k === SCHEDULE.length - 1)
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
      }, n.at),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (!now) return;
    const id = setTimeout(() => setNow(null), SHOW_MS);
    return () => clearTimeout(id);
  }, [now]);

  if (!now) return null;
  const act = {
    mail: () => onOpen("mail"),
    term: () => onOpen("term"),
    agents: () => onOpen("code", "agents"),
  }[now.id];
  return (
    <div
      role="status"
      key={now.id}
      className="group fixed right-3 top-10 z-[1100] w-[340px] animate-[notify-in_0.4s_cubic-bezier(0.2,0.9,0.3,1.2)]"
    >
      <button
        type="button"
        onClick={() => {
          setNow(null);
          act();
        }}
        className="flex w-full items-start gap-3 rounded-2xl border border-white/15 bg-[#2a2c33]/85 p-3 text-left text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl hover:bg-[#33353d]/90"
      >
        <AppTile app={now.app} size="h-9 w-9 rounded-[9px]" />
        <span className="min-w-0 flex-1">
          <span className="flex justify-between text-[13px] font-semibold">
            {t(`desktop.notify.${now.id}.title`)}
            <span className="text-[11px] font-normal text-white/50">
              {t("desktop.notify.now")}
            </span>
          </span>
          <span className="block text-[12.5px] leading-snug text-white/80">
            {t(`desktop.notify.${now.id}.body`)}
          </span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => setNow(null)}
        aria-label={t("desktop.notify.dismiss")}
        className="absolute -left-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-[#3a3c44] text-[11px] text-white group-focus-within:flex group-hover:flex"
      >
        ✕
      </button>
    </div>
  );
};

export default Notifications;
