import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PdfIcon from "../assets/icons/apps/pdf.png";
import Alert from "./Alert";

// Shown when CV.pdf is dropped on the Trash. Deleting it is refused.
const TrashDialog = ({ onClose }) => {
  const { t } = useTranslation();
  const [denied, setDenied] = useState(false);
  return denied ? (
    <Alert
      key="denied"
      icon={PdfIcon}
      title={t("desktop.trashCv.deniedTitle")}
      body={t("desktop.trashCv.deniedBody")}
      buttons={[{ label: "OK", act: onClose, primary: true }]}
      onClose={onClose}
    />
  ) : (
    <Alert
      icon={PdfIcon}
      title={t("desktop.trashCv.title")}
      body={t("desktop.trashCv.body")}
      buttons={[
        { label: t("desktop.trashCv.delete"), act: () => setDenied(true) },
        { label: t("desktop.trashCv.keep"), act: onClose, primary: true },
      ]}
      onClose={onClose}
    />
  );
};

export default TrashDialog;
