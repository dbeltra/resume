import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

const RangeInput = ({
  label,
  helperText,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  formatValue = (val) => `${val}%`,
}) => (
  <div>
    <div className="flex items-center justify-between mb-1">
      <span>{label}</span>
      {helperText && (
        <span className="text-xs text-gray-400">{helperText}</span>
      )}
    </div>
    <div className="flex items-center justify-between">
      <div className="flex items-center w-full">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="w-full mr-2 
            appearance-none 
            h-2 
            bg-gray-700 
            rounded-full 
            outline-none
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-primary-500
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:bg-primary-500
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:cursor-pointer"
        />
        <span className="text-gray-400 w-16 text-right">
          {formatValue(value)}
        </span>
      </div>
    </div>
  </div>
);

const SettingsSection = ({ icon, title, helperText, children }) => (
  <div className=" p-4 text-sm">
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

const Settings = () => {
  const { bgOpacity, setBgOpacity, scale, setScale } = useOutletContext();

  const handleOpacityChange = (e) => {
    const newValue = parseInt(e.target.value, 10) / 100;
    setBgOpacity(newValue);
  };

  const handleScaleChange = (e) => {
    const newScale = parseInt(e.target.value, 10);
    setScale(newScale);
  };

  return (
    <div className="col-start-2 col-span-2 row-start-2 flex flex-col lg:grid grid-rows-subgrid grid-cols-subgrid min-h-screen">
      <div className="grid grid-rows-subgrid grid-cols-subgrid gap-4">
        <SettingsSection
          icon="format_size"
          title="Interface Appearance"
          helperText="Customize the visual appearance of the interface"
        >
          <RangeInput
            label="Background Opacity"
            helperText="Adjust the transparency of the main interface"
            value={bgOpacity * 100}
            onChange={handleOpacityChange}
            min={0}
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
        </SettingsSection>
      </div>
    </div>
  );
};

export default Settings;
