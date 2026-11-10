import React from "react";
import { useTranslation } from "react-i18next";
import Window from "../components/Window";

// The real CV PDFs live in public/cv/. Catalan uses the English one.
export const cvFile = (lang) =>
  `David-Beltra-CV-${lang === "es" ? "ES" : "EN"}.pdf`;
export const useCvUrl = () => {
  const { i18n } = useTranslation();
  const file = cvFile(i18n.resolvedLanguage);
  return { file, url: `${process.env.PUBLIC_URL}/cv/${file}` };
};

const ToolLink = ({ label, icon, ...p }) => (
  <a
    aria-label={label}
    title={label}
    className="flex h-8 w-8 items-center justify-center rounded-md text-[#c9cbd1] hover:bg-white/10 hover:text-white"
    {...p}
  >
    <i className="material-symbols-outlined" aria-hidden="true">
      {icon}
    </i>
  </a>
);

const Preview = ({ win }) => {
  const { t } = useTranslation();
  const { file, url } = useCvUrl();

  return (
    <Window
      {...win}
      label={t("desktop.apps.pdf")}
      rect={{ w: 640, h: 860 }}
      className="border border-[#3a3b40] bg-[#2b2c30] text-ink-text"
      barClassName="h-11 border-b border-[#1f2023] bg-[#38393e]"
      toolbar={
        <>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[13px] font-semibold">{file}</div>
            <div className="text-[11px] text-[#a7a9b0]">
              {t("desktop.preview.page")}
            </div>
          </div>
          <ToolLink
            label={t("desktop.preview.open")}
            icon="open_in_new"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
          />
          <ToolLink
            label={t("desktop.preview.download")}
            icon="download"
            href={url}
            download={file}
          />
        </>
      }
      phoneToolbar={
        <ToolLink
          label={t("desktop.preview.download")}
          icon="download"
          href={url}
          download={file}
        />
      }
    >
      {/* the browser's own PDF viewer; its toolbar is hidden since the
          window already has one */}
      <iframe
        key={url}
        src={`${url}#toolbar=0&navpanes=0&view=FitH`}
        title={file}
        className="min-h-0 w-full flex-1 border-0 bg-[#2b2c30]"
      />
    </Window>
  );
};

export default Preview;
