import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: (selectedDates: Date[], dateStr: string) => void;
  defaultDate?: Date | string;
  label?: string;
  placeholder?: string;
  success?: boolean;
  error?: boolean;
  hint?: string;
  disabled?: boolean;
  ref?: React.Ref<HTMLInputElement>;
  value?: string;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  success,
  error,
  hint,
  disabled,
  ref,
  value,
}: PropsType) {
  const normalizeDate = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  useEffect(() => {
    // 4️⃣ Flatpickr instance
    const fp = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "d-m-Y",
      defaultDate,
      onChange,
    });

    return () => {
      if (!Array.isArray(fp)) fp.destroy();
    };
  }, [id, mode, onChange, defaultDate]);

  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800`;
  if (error) {
    inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-error/30  bg-transparent text-gray-800 border-error-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-error-700  dark:focus:border-brand-800`;
  } else if (success) {
    inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-success-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-success/30  bg-transparent text-success-800 border-success-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-success-700  dark:focus:border-brand-800`;
  }

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="relative">
        <input
          id={id}
          placeholder={placeholder}
          className={inputClasses}
          disabled={disabled}
          ref={ref}
          value={value}
        />
        <span
          className={`absolute ${
            error
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          } -translate-y-1/2 pointer-events-none right-3 mt-6 dark:text-gray-400`}
        >
          <CalenderIcon className="size-6" />
        </span>
        {hint && (
          <p
            className={`mt-1.5 text-xs ${
              error
                ? "text-error-500"
                : success
                ? "text-success-500"
                : "text-gray-500"
            }`}
          >
            {hint}
          </p>
        )}
      </div>
    </div>
  );
}
