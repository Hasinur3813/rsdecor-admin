"use client";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store";
import {
  setSessionExpiredHandler,
  setForbiddenHandler,
} from "@/lib/axiosInstance";
import { setSessionExpired } from "@/store/slices/authSlice";

function InitializeAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;

    setSessionExpiredHandler(() => {
      if (mounted) {
        dispatch(setSessionExpired());
      }
    });

    setForbiddenHandler(() => {
      if (mounted) {
        dispatch(setSessionExpired());
      }
    });

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  return null;
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <InitializeAuth />
      {children}
    </Provider>
  );
}
