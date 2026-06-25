"use client";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Layers, Loader2 } from "lucide-react";
import { initAuth } from "@/store/slices/authSlice";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "./LoginForm";

const EXPIRY_CHECK_MS = 60 * 1000;

export default function AuthGuard({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, initializing } = useAuth();
  const intervalRef = useRef(null);

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!initializing && !isAuthenticated) {
      router.replace("/login?reason=unauthorized");
    }
  }, [initializing, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkExpiry = () => {
      if (typeof window === "undefined") return;
      const expiry = localStorage.getItem("rs_admin_token_expiry");
      if (!expiry || Date.now() > Number(expiry)) {
        localStorage.removeItem("rs_admin_token");
        localStorage.removeItem("rs_admin_user");
        localStorage.removeItem("rs_admin_token_expiry");
        router.replace("/login?reason=session_expired");
      }
    };

    checkExpiry();
    intervalRef.current = setInterval(checkExpiry, EXPIRY_CHECK_MS);
    return () => clearInterval(intervalRef.current);
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        const expiry = localStorage.getItem("rs_admin_token_expiry");
        if (!expiry || Date.now() > Number(expiry)) {
          router.replace("/login?reason=session_expired");
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated && !initializing) {
      window.history.replaceState(null, "", "/login");
    }
  }, [isAuthenticated, initializing]);

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
