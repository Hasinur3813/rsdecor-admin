"use client";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store";
import { setSessionExpiredHandler } from "@/lib/axiosInstance";
import { fetchMe, setSessionExpired } from "@/store/slices/authSlice";
import toast from "react-hot-toast";

function InitializeAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Set up session expired handler
    setSessionExpiredHandler(() => {
      dispatch(setSessionExpired());
      toast.error("Your session has expired. Please sign in again.");
    });

    // Initialize auth state
    dispatch(fetchMe());
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
