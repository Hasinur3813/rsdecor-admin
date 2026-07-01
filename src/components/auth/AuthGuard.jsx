"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Layers, Loader2 } from "lucide-react";
import { fetchMe } from "@/store/slices/authSlice";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "./LoginForm";

export default function AuthGuard({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated, initializing } = useAuth();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      window.history.replaceState(null, "", "/login");
    }
  }, [initializing, isAuthenticated]);

  if (initializing) {
    return (
      <div className="min-h-screen bg-sidebar flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
            <Layers className="w-7 h-7 text-primary" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-sm text-white/30">Verifying session...</p>
          </div>
          <div className="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full animate-pulse"
              style={{ width: "60%" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <LoginForm />;

  return <>{children}</>;
}
