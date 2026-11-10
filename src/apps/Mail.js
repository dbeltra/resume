import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Window from "../components/Window";

// Compose window that hands off to the visitor's mail client via mailto:.
const Mail = ({ win }) => {
  const { t } = useTranslation();
  const [subject, setSubject] = useState(t("desktop.mail.subjectDefault"));
  const [body, setBody] = useState("");
  const href = `mailto:dbeltra@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const sendButton = (
    <a
      href={href}
      className="inline-flex min-h-[30px] items-center gap-1.5 rounded-[7px] bg-lilac px-3 text-[13px] font-semibold text-ink-950 hover:brightness-110"
    >
      <i className="material-symbols-outlined text-[17px]" aria-hidden="true">
        send
      </i>
      {t("desktop.mail.send")}
    </a>
  );

  return (
    <Window
      {...win}
      label={t("desktop.apps.mail")}
      rect={{ w: 520, h: 430 }}
      className="border border-[#343741] bg-[#1e2026] text-ink-text"
      barClassName="h-11 border-b border-[#343741] bg-[#262932]"
      toolbar={
        <>
          <span className="flex-1 text-[13px] font-semibold">
            {t("desktop.mail.title")}
          </span>
          {sendButton}
        </>
      }
      phoneToolbar={sendButton}
    >
      <div className="flex items-center gap-2.5 border-b border-[#2e313a] px-4 py-2.5 text-sm">
        <span className="w-16 text-ink-muted">{t("desktop.mail.to")}</span>
        <span className="rounded-full bg-[#2e3340] px-2.5 py-0.5">
          David Beltrà &lt;dbeltra@gmail.com&gt;
        </span>
      </div>
      <label className="flex items-center gap-2.5 border-b border-[#2e313a] px-4 py-2.5 text-sm">
        <span className="w-16 text-ink-muted">{t("desktop.mail.subject")}</span>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="flex-1 bg-transparent outline-none"
        />
      </label>
      <label className="flex min-h-0 flex-1 px-4 py-3.5">
        <span className="sr-only">{t("desktop.mail.message")}</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={t("desktop.mail.placeholder")}
          className="flex-1 resize-none bg-transparent text-sm leading-relaxed outline-none placeholder:text-ink-muted"
        />
      </label>
    </Window>
  );
};

export default Mail;
