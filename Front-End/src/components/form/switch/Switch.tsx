import React, { useEffect, useRef, useState } from "react";

interface SwitchProps {
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  color?: "blue" | "gray"; // toggle color theme
}

export default function Switch({
  label,
  defaultChecked = false,
  disabled = false,
  onChange,
  color = "blue",
}: SwitchProps) {
  const [checked, setChecked] = useState<boolean>(defaultChecked);
  // stable id for accessibility
  const idRef = useRef<string>(
    `switch-${Math.random().toString(36).slice(2, 9)}`
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const next = e.target.checked;
    setChecked(next);
    onChange?.(next);
  };
  useEffect(() => {
    setChecked(defaultChecked);
  }, [defaultChecked]);
  // compute classes for track and knob using Tailwind-ish names
  const trackClass = disabled
    ? "h-6 w-11 rounded-full bg-gray-100 dark:bg-gray-800 pointer-events-none"
    : checked
    ? color === "blue"
      ? "h-6 w-11 rounded-full bg-brand-500"
      : "h-6 w-11 rounded-full bg-gray-800"
    : "h-6 w-11 rounded-full bg-gray-200 dark:bg-white/10";

  const knobClass = `absolute top-0.5 h-5 w-5 rounded-full shadow-theme-sm transform transition-transform duration-150 ease-linear ${
    checked ? "translate-x-full bg-white" : "translate-x-0 bg-white"
  }`;

  return (
    <div
      className={`flex items-center gap-3 text-sm font-medium ${
        disabled ? "text-gray-400" : "text-gray-700 dark:text-gray-400"
      }`}
    >
      <label
        htmlFor={idRef.current}
        className="flex items-center cursor-pointer select-none"
      >
        {/* Native checkbox (visually hidden but accessible) */}
        <input
          id={idRef.current}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          aria-checked={checked}
          aria-disabled={disabled}
        />

        {/* Visual switch */}
        <div className="relative">
          <div
            className={`${trackClass} transition duration-150 ease-linear`}
          />
          <div className={`${knobClass} absolute left-0.5`} />
        </div>

        {/* Label text */}
        <span className="ml-3">{label}</span>
      </label>
    </div>
  );
}
