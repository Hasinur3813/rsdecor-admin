"use client";
import { cn } from "@/lib/utils";

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
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
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          "w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none",
          error
            ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            : "border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary",
          disabled && "bg-gray-50 cursor-not-allowed opacity-60"
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
