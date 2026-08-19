"use client";
import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { logoutAdmin, clearError } from "@/store/slices/authSlice";
import { ADMIN_ROLES } from "@/lib/authConstants";

export function useAuth() {
  const dispatch = useDispatch();

  const {
    admin,
    isAuthenticated,
    hasValidRole,
    loading,
    initializing,
    error,
    sessionExpired,
    hasCheckedInitialAuth,
  } = useSelector((s) => s.auth);

  const logout = useCallback(async (silent = false) => {
    dispatch(logoutAdmin());
    if (!silent) toast.success("Logged out successfully");
    setTimeout(() => {
      window.location.href = "/login";
    }, silent ? 0 : 300);
  }, [dispatch]);

  const dismissError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const requireRole = useCallback(
    (roleOrRoles) => {
      if (!isAuthenticated || !admin?.role) return false;
      const required = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];
      const normalized = required.map((r) => String(r).toLowerCase());
      const currentRole = String(admin.role).toLowerCase();
      return normalized.includes(currentRole);
    },
    [isAuthenticated, admin],
  );

  const isAdminUser = isAuthenticated && hasValidRole &&
    admin?.role &&
    ADMIN_ROLES.includes(String(admin.role).toLowerCase());

  return {
    admin,
    isAuthenticated: isAdminUser,
    hasValidRole,
    loading,
    initializing,
    error,
    sessionExpired,
    hasCheckedInitialAuth,
    logout,
    dismissError,
    requireRole,
  };
}
