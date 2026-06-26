"use client";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, X } from "lucide-react";

export default function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select options",
  disabled = false,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const toggleOption = (option) => {
    if (value.includes(option)) {
      onChange(value.filter((item) => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const removeOption = (option, e) => {
    e.stopPropagation();
    onChange(value.filter((item) => item !== option));
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-sm font-semibold text-gray-800">{label}</label>
      )}
      <div className="relative">
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "w-full px-4 py-3 rounded-xl border text-sm transition-all cursor-pointer flex flex-wrap gap-2 items-center",
            disabled
              ? "bg-gray-50 opacity-60 cursor-not-allowed"
              : "hover:border-gray-300",
            "border-gray-200",
            "focus-within:border-primary focus-within:ring-1 focus-within:ring-primary",
          )}
        >
          {value.length > 0 ? (
            value.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
              >
                {item}
                {!disabled && (
                  <button
                    onClick={(e) => removeOption(item, e)}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
          <ChevronDown className="ml-auto w-4 h-4 text-gray-400" />
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-gray-200 shadow-lg max-h-68 overflow-y-auto">
            {options.map((option, index) => {
              const isSelected = value.includes(option);
              return (
                <div
                  key={index}
                  onClick={() => toggleOption(option)}
                  className={cn(
                    "px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between",
                    isSelected
                      ? "bg-primary/5 text-primary"
                      : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  {option}
                  {isSelected && <Check className="w-4 h-4" />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
