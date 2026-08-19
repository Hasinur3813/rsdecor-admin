import axios from "axios";
import { buildLoginUrl } from "@/lib/authConstants";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

let isRefreshing = false;
let failedQueue = [];
let onSessionExpired = null;
let onForbidden = null;

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

const isAuthEndpoint = (url = "") =>
  url.includes("/auth/login") ||
  url.includes("/auth/admin/login") ||
  url.includes("/auth/register") ||
  url.includes("/auth/refresh-token") ||
  url.includes("/auth/logout");

const readCsrfCookie = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/i);
  return match ? decodeURIComponent(match[1]) : null;
};

const getCurrentPath = () => {
  if (typeof window === "undefined") return "/";
  return window.location.pathname + window.location.search;
};

const hardRedirectToLogin = (reason) => {
  if (typeof window === "undefined") return;
  const redirectPath = getCurrentPath();
  window.location.href = buildLoginUrl(redirectPath, reason);
};

export const setSessionExpiredHandler = (handler) => {
  onSessionExpired = handler;
};

export const setForbiddenHandler = (handler) => {
  onForbidden = handler;
};

axiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = readCsrfCookie();
    if (csrfToken && config.headers) {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }
    return config;
  },
  (err) => Promise.reject(err),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403 && typeof window !== "undefined") {
      onForbidden?.();
      hardRedirectToLogin("unauthorized");
      return Promise.reject(error);
    }

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => axiosInstance(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await axiosInstance.post("/auth/refresh-token");
      processQueue(null);
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      onSessionExpired?.();
      hardRedirectToLogin("session_expired");
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
