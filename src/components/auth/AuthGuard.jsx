"use client";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { fetchMe, setSessionExpired } from "@/store/slices/authSlice";
import { ADMIN_ROLES, buildLoginUrl } from "@/lib/authConstants";
import Loading from "app/loading";

export default function AuthGuard({ children }) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const fetchAbortRef = useRef(null);
  const redirectedRef = useRef(false);

  const { hasCheckedInitialAuth, initializing, isAuthenticated, admin } =
    useSelector((state) => state.auth);

  const hasValidRole =
    isAuthenticated &&
    admin?.role &&
    ADMIN_ROLES.includes(String(admin.role).toLowerCase());

  useEffect(() => {
    if (pathname === "/login") return;
    if (hasCheckedInitialAuth) return;

    if (fetchAbortRef.current) {
      fetchAbortRef.current.abort();
    }

    const abort = new AbortController();
    fetchAbortRef.current = abort;

    dispatch(fetchMe())
      .unwrap()
      .catch(() => {
        if (abort.signal.aborted) return;
        dispatch(setSessionExpired());
        if (redirectedRef.current) return;
        redirectedRef.current = true;
        window.location.href = buildLoginUrl(pathname, "session_expired");
      });

    return () => {
      abort.abort();
    };
  }, [dispatch, pathname, hasCheckedInitialAuth]);

  useEffect(() => {
    if (!hasCheckedInitialAuth || initializing) return;
    if (redirectedRef.current) return;

    if (!isAuthenticated) {
      redirectedRef.current = true;
      window.location.href = buildLoginUrl(pathname, "auth_required");
      return;
    }

    if (isAuthenticated && admin && !hasValidRole) {
      redirectedRef.current = true;
      dispatch(setSessionExpired());
      window.location.href = buildLoginUrl("/", "unauthorized");
      return;
    }
  }, [
    hasCheckedInitialAuth,
    initializing,
    isAuthenticated,
    admin,
    hasValidRole,
    pathname,
    dispatch,
  ]);

  if (initializing || !hasCheckedInitialAuth) {
    return <Loading />;
  }

  if (!isAuthenticated || !hasValidRole) {
    return <Loading />;
  }

  return children;
}
