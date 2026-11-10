import React from "react";
import { useTranslation } from "react-i18next";
import Avatar from "../components/Avatar";

// "About This Mac", for a person.
const AboutDialog = ({ onClose, onMore }) => {
  const { t } = useTranslation();
  const specs = t("desktop.aboutDev.specs", {
    returnObjects: true,
    years: new Date().getFullYear() - 2014,
  });
  return (
    <div
      className="fixed inset-0 z-[9000] flex items-start justify-center pt-[12vh]"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-[300px] animate-[app-open_0.2s_ease-out] flex-col items-center rounded-xl border border-white/10 bg-[#2a2c33]/95 px-6 pb-6 pt-9 text-center text-white shadow-2xl backdrop-blur-xl"
      >
        <button
          type="button"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onClick={onClose}
          aria-label={t("desktop.aboutDev.close")}
          className="absolute left-3 top-3 h-3 w-3 rounded-full bg-[#e5534b] hover:brightness-110"
        />
        <div className="mb-4">
          <Avatar />
        </div>
        <h2 id="about-title" className="text-[22px] font-bold">
          David Beltrà
        </h2>
        <p className="mb-4 text-[12px] text-white/60">
          {t("desktop.aboutDev.model")}
        </p>
        <dl className="mb-5 grid w-full grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-left text-[11.5px]">
          {specs.map((s) => (
            <React.Fragment key={s.k}>
              <dt className="text-right font-semibold">{s.k}</dt>
              <dd className="text-white/70">{s.v}</dd>
            </React.Fragment>
          ))}
        </dl>
        <button
          type="button"
          onClick={onMore}
          className="min-h-[28px] rounded-md bg-white/15 px-4 text-[13px] font-medium hover:bg-white/25"
        >
          {t("desktop.aboutDev.more")}
        </button>
        <p className="mt-4 text-[10px] text-white/40">
          ™ and © 2014–{new Date().getFullYear()} David Beltrà
        </p>
      </div>
    </div>
  );
};

export default AboutDialog;
