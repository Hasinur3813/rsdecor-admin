"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { logoutAdmin, clearError } from "@/store/slices/authSlice";

export function useAuth() {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    admin,
    isAuthenticated,
    loading,
    initializing,
    error,
    sessionExpired,
  } = useSelector((s) => s.auth);

  const logout = useCallback(async (silent = false) => {
     dispatch(logoutAdmin());
    if (!silent) toast.success("Logged out successfully");
    router.replace("/login");
  }, [dispatch, router]);

  const dismissError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    admin,
    isAuthenticated,
    loading,
    initializing,
    error,
    sessionExpired,
    logout,
    dismissError,
  };
}
