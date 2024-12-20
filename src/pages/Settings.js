import React, { useState } from "react";

const CheckboxGroup = ({ label, helperText, options, checked, onChange }) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <span className="block mb-1 font-semibold">{label}</span>
      {helperText && (
        <span className="text-xs text-gray-400">{helperText}</span>
      )}
    </div>
    <div className="space-y-1">
      {Object.entries(options).map(([source, isChecked]) => (
        <div key={source} className="flex items-center">
          <input
            type="checkbox"
            id={source}
            checked={isChecked}
            onChange={() => onChange(source)}
            className="
              mr-2 

            "
          />
          <label
            htmlFor={source}
            className="
            "
          >
            {source
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </label>
        </div>
      ))}
    </div>
  </div>
);

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
            bg-gray-600 
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
  const [chocolatePrecision, setChocolatePrecision] = useState(0.75);
  const [BurnoutPrevention, setBurnoutPrevention] = useState(17);
  const [chocolateSourceChecked, setChocolateSourceChecked] = useState({
    darkChocolate: true,
    milkChocolate: false,
    whiteChocolate: true,
  });

  const handleChocolateSourceToggle = (source) => {
    setChocolateSourceChecked((prev) => ({
      ...prev,
      [source]: !prev[source],
    }));
  };

  return (
    <div className="p-4 col-start-2 col-span-2 bg-gray-700">
      <div className="grid grid-rows-subgrid grid-cols-2 gap-4">
        <SettingsSection
          icon="bug_report"
          title="Debugging Multiverse"
          helperText="Configure your debugging experience across multiple dimensions of complexity"
        >
          <div className="flex items-center justify-between">
            <span>Breakpoint Quantum Entanglement</span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max="42"
                defaultValue="7"
                className="w-16 bg-gray-600 text-white p-1 rounded"
              />
              <span>dimensions</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="block mb-1">Debugging Modes</span>
            <div className="grid grid-cols-2 gap-1">
              {["Chaos", "Zen", "Rage", "Enlightened"].map((mode) => (
                <label key={mode} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="debugMode"
                    value={mode.toLowerCase()}
                    className="mr-1"
                  />
                  {mode}
                </label>
              ))}
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          icon="palette"
          title="Existential Aesthetics"
          helperText="Customize the metaphysical appearance of your coding environment"
        >
          <div className="flex items-center justify-between">
            <span>Code Existentialism</span>
            <select className="bg-gray-600 text-white p-1 rounded">
              <option>nihilistic minimalism</option>
              <option>absurdist maximalism</option>
              <option>zen complexity</option>
              <option>chaotic neutrality</option>
            </select>
          </div>
          <RangeInput
            label="Burnout Prevention"
            value={BurnoutPrevention}
            onChange={(e) => setBurnoutPrevention(parseInt(e.target.value, 10))}
          />
        </SettingsSection>

        <SettingsSection
          icon="cookie"
          title="Chocolate Calibration"
          helperText="Fine-tune your chocolate-powered development ecosystem"
        >
          <RangeInput
            label="Chocolate Precision"
            value={chocolatePrecision}
            onChange={(e) => setChocolatePrecision(parseFloat(e.target.value))}
            min={0}
            max={1}
            step={0.01}
            formatValue={(val) => `${(val * 100).toFixed(0)}%`}
          />
          <CheckboxGroup
            label="Chocolate Energy Sources"
            options={chocolateSourceChecked}
            checked={chocolateSourceChecked}
            onChange={handleChocolateSourceToggle}
          />
        </SettingsSection>

        <SettingsSection
          icon="memory"
          title="Memory Alchemy"
          helperText="Transmute and optimize your computational memory essence"
        >
          <div className="flex items-center justify-between">
            <span>Memory Leak Transmutation</span>
            <div className="flex items-center space-x-2">
              <label className="switch">
                <input type="checkbox" className="hidden" />
                <span className="slider round bg-gray-600"></span>
              </label>
              <span>Experimental</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="block mb-1">Memory Optimization Rituals</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                "Garbage Collection",
                "Cache Alignment",
                "Pointer Meditation",
                "Stack Cleansing",
              ].map((ritual) => (
                <label key={ritual} className="inline-flex items-center">
                  <input type="checkbox" className="mr-1" />
                  {ritual}
                </label>
              ))}
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};

export default Settings;
