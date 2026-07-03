"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="flex-1 min-h-[50vh] flex flex-col items-center justify-center p-6 bg-surface">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-red-100 max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900 font-heading">
            Something went wrong!
          </h2>
          <p className="text-sm text-gray-500">
            {error?.message || "An unexpected error occurred while loading this page."}
          </p>
        </div>

        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center space-x-2 w-full px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-medium text-sm"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Try again</span>
        </button>
      </div>
    </div>
  );
}
