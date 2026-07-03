import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-1 min-h-screen flex items-center justify-center p-6">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}