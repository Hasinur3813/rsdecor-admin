"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { fetchMe, setSessionExpired } from "@/store/slices/authSlice";

export default function AuthGuard({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  
  // Grab states directly from Redux to prevent route-change resets
  const { hasCheckedInitialAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only fetch if we haven't performed the initial check yet and we are not on login page
    if (!hasCheckedInitialAuth && pathname !== '/login') {
      dispatch(fetchMe())
        .unwrap()
        .catch(() => {
          // If fetchMe fails, the token is likely invalid or expired
          dispatch(setSessionExpired());
          router.replace("/login");
        });
    }
  }, [dispatch, hasCheckedInitialAuth, pathname, router]);

  // Middleware handles the initial auth check and redirecting unauthenticated users. 
  // We no longer block the UI with a full-screen spinner. 
  // The layout renders immediately for a seamless, flicker-free experience.
  return <>{children}</>;
}