import React from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RangeInput from "../components/RangeInput";
import TabContent from "../components/TabContent";

const SettingsSection = ({ icon, title, helperText, children, className }) => (
  <div className={`text-sm lg:w-1/2 ${className}`}>
    <div className="mb-3">
      <div className="flex items-center border-b">
        <span className="material-symbols-outlined mr-2 text-primary-500 mb-1">
          {icon}
        </span>
        <h2 className="text-lg font-semibold mb-1">{title}</h2>
      </div>
      {helperText && <p className="text-xs text-gray-400 mt-2">{helperText}</p>}
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);

const SettingsContent = () => {
  const { t, i18n } = useTranslation();

  const {
    bgOpacity,
    setBgOpacity,
    scale,
    setScale,
    fontFamily,
    setFontFamily,
  } = useOutletContext();

  const handleOpacityChange = (e) => {
    const newValue = parseInt(e.target.value, 10) / 100;
    setBgOpacity(newValue);
  };

  const handleScaleChange = (e) => {
    const newScale = parseInt(e.target.value, 10);
    setScale(newScale);
  };

  const handleFontChange = (e) => {
    setFontFamily(e.target.value);
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <div className="px-4">
      <SettingsSection
        icon="translate"
        title={t("settingsLanguageTitle")}
        helperText={t("settingsLanguageHelper")}
      >
        <div>
          <select
            value={i18n.language}
            onChange={handleLanguageChange}
            className="w-full bg-gray-700 text-white p-2 rounded outline-none cursor-pointer hover:bg-gray-500"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="ca">Català</option>
          </select>
        </div>
      </SettingsSection>
      <SettingsSection
        icon="brand_family"
        title={t("settingsAppearanceTitle")}
        helperText={t("settingsAppearanceHelper")}
        className="mt-4"
      >
        <RangeInput
          label={t("settingsAppearanceOpacityTitle")}
          helperText={t("settingsAppearanceOpacityHelper")}
          value={bgOpacity * 100}
          onChange={handleOpacityChange}
          min={50}
          max={100}
          step={1}
          formatValue={(val) => `${Math.round(val)}%`}
        />

        <div>
          <div className="flex items-center justify-between mb-1">
            <span>{t("settingsAppearanceScaleTitle")}</span>
            <span className="text-xs text-gray-400">
              {t("settingsAppearanceScaleHelper")}
            </span>
          </div>
          <select
            value={scale}
            onChange={handleScaleChange}
            className="w-full bg-gray-700 text-white p-2 rounded outline-none cursor-pointer hover:bg-gray-500"
          >
            {t("settingsAppearanceScaleOptions", { returnObjects: true }).map(
              (option, index) => (
                <option
                  key={index}
                  value={
                    index === 0
                      ? 110
                      : index === 1
                        ? 100
                        : index === 2
                          ? 90
                          : 75
                  }
                >
                  {option}
                </option>
              ),
            )}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span>{t("settingsAppearanceFontTitle")}</span>
            <span className="text-xs text-gray-400">
              {t("settingsAppearanceHelper")}
            </span>
          </div>
          <select
            value={fontFamily}
            onChange={handleFontChange}
            className="w-full bg-gray-700 text-white p-2 rounded outline-none cursor-pointer hover:bg-gray-500"
          >
            <option value="Roboto">Roboto</option>
            <option value="Cutive Mono">Cutive Mono</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Tahoma">Tahoma</option>
          </select>
        </div>
      </SettingsSection>
    </div>
  );
};

const Settings = () => {
  return <TabContent Content={SettingsContent}></TabContent>;
};

export default Settings;
