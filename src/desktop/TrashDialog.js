import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PdfIcon from "../assets/icons/apps/pdf.png";

// Shown when CV.pdf is dropped on the Trash. Deleting it is refused.
const TrashDialog = ({ onClose }) => {
  const { t } = useTranslation();
  const [denied, setDenied] = useState(false);
  const btn = "min-h-[28px] flex-1 rounded-md px-3 text-[13px] font-medium";
  return (
    <div
      className="fixed inset-0 z-[9000] flex items-start justify-center bg-black/20 pt-[18vh]"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="trash-title"
        onClick={(e) => e.stopPropagation()}
        className="flex w-[280px] animate-[app-open_0.2s_ease-out] flex-col items-center gap-3 rounded-xl border border-white/10 bg-[#2a2c33]/95 p-5 text-center text-white shadow-2xl backdrop-blur-xl"
      >
        <img src={PdfIcon} alt="" className="h-14 w-14" />
        <h2 id="trash-title" className="text-[14px] font-semibold">
          {t(denied ? "desktop.trashCv.deniedTitle" : "desktop.trashCv.title")}
        </h2>
        <p className="text-[12px] text-white/70">
          {t(denied ? "desktop.trashCv.deniedBody" : "desktop.trashCv.body")}
        </p>
        <div className="flex w-full gap-2">
          {denied ? (
            // eslint-disable-next-line jsx-a11y/no-autofocus
            <button
              autoFocus
              type="button"
              onClick={onClose}
              className={`${btn} bg-[#0a84ff]`}
            >
              OK
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setDenied(true)}
                className={`${btn} bg-white/15`}
              >
                {t("desktop.trashCv.delete")}
              </button>
              {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
              <button
                autoFocus
                type="button"
                onClick={onClose}
                className={`${btn} bg-[#0a84ff]`}
              >
                {t("desktop.trashCv.keep")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrashDialog;
