"use client";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export default function Select({
  label,
  options,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  placeholder = "Select an option",
  className,
  ...props
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-sm font-semibold text-gray-800">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none appearance-none bg-white cursor-pointer",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
              : "border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary",
            disabled && "bg-gray-50 cursor-not-allowed opacity-60",
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option, idx) => (
            <option key={idx} value={option.value || option}>
              {option.label || option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
