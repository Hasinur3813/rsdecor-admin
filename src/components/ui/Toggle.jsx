"use client";
import { cn } from "@/lib/utils";

export default function Toggle({
  label,
  checked,
  onChange,
  disabled = false,
  className,
}) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {label && (
        <span className="text-sm font-semibold text-gray-800">{label}</span>
      )}
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={cn(
          "relative w-12 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          checked ? "bg-primary" : "bg-gray-200",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm",
            checked ? "translate-x-6" : "translate-x-0"
          )}
        />
      </button>
    </div>
  );
}
