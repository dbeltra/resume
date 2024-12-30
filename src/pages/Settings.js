import React from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import RangeInput from "../components/RangeInput";
import TabContent from "../components/TabContent";

const SettingsSection = ({ icon, title, helperText, children, className }) => (
  <div className={`text-sm w-1/2 ${className}`}>
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
    i18n.changeLanguage(selectedLanguage); // Change the language dynamically
  };

  return (
    <div className="">
      <SettingsSection
        icon="translate"
        title="Language settings"
        helperText="Customize the language"
      >
        <div>
          <select
            value={i18n.language}
            onChange={handleLanguageChange}
            className="w-full bg-gray-700 text-white p-2 rounded outline-none cursor-pointer hover:bg-gray-500"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      </SettingsSection>
      <SettingsSection
        icon="format_size"
        title="Interface Appearance"
        helperText="Customize the visual appearance of the interface"
        className="mt-4"
      >
        <RangeInput
          label="Background Opacity"
          helperText="Adjust the transparency of the main interface"
          value={bgOpacity * 100}
          onChange={handleOpacityChange}
          min={50}
          max={100}
          step={1}
          formatValue={(val) => `${Math.round(val)}%`}
        />

        <div>
          <div className="flex items-center justify-between mb-1">
            <span>Interface Scale</span>
            <span className="text-xs text-gray-400">
              Adjust the overall size of the interface
            </span>
          </div>
          <select
            value={scale}
            onChange={handleScaleChange}
            className="w-full bg-gray-700 text-white p-2 rounded outline-none cursor-pointer hover:bg-gray-500"
          >
            <option value={100}>Default</option>
            <option value={90}>Small</option>
            <option value={75}>Tiny</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span>Font Family</span>
            <span className="text-xs text-gray-400">Choose the app's font</span>
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
