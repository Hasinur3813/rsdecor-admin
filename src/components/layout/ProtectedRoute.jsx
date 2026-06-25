"use client";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // or a loading spinner
  }

  return children;
}
