import React from "react";
import { useTranslation } from "react-i18next";
import ImgOops from "../assets/images/oops.webp";
import MessageWindow from "../components/MessageWindow";

const RestoreMessage = ({ onRestore }) => {
  const { t } = useTranslation();
  return (
    <MessageWindow
      message={t("restoreWindowTitle")}
      image={ImgOops}
      imgAlt={t("restoreWindowImg")}
      buttonAction={onRestore}
      buttonText={t("restoreWindowButton")}
    />
  );
};

export default RestoreMessage;
