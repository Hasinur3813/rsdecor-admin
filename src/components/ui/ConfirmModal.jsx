import React, { useEffect, useState } from "react";
import { AlertCircle, AlertTriangle, Info, X, Loader2 } from "lucide-react";
import Button from "./Button";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  isLoading = false,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const config = {
    danger: {
      icon: AlertCircle,
      iconColor: "text-red-600",
      iconBg: "bg-red-50",
    },
    warning: {
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
    },
    info: {
      icon: Info,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
    },
  };

  const { icon: Icon, iconColor, iconBg } = config[type] || config.danger;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal Card */}
      <div
        className={`relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transition-all duration-200 ${
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* Close Button */}
        {!isLoading && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${iconBg}`}
            >
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500">{message}</p>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end rounded-b-2xl">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto ${
              type === "danger"
                ? "bg-red-600 hover:bg-red-700 text-white border-transparent"
                : ""
            }`}
          >
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
