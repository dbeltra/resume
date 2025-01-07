import React from "react";
import { useTranslation } from "react-i18next";
import ImgNotFound from "../assets/images/notfound.webp";
import MessageWindow from "../components/MessageWindow";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <MessageWindow
      message={t("notFoundTitle")}
      image={ImgNotFound}
      imgAlt={t("notFoundImg")}
      buttonAction={() => window.history.back()}
      buttonText={t("notFoundButton")}
    />
  );
};

export default NotFound;
