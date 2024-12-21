import React from "react";

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

export default RangeInput;
