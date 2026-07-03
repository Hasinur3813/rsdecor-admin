import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => config,
  (err) => Promise.reject(err),
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      const url = err.config?.url || "";
      if (!url.includes("/auth/")) {
        window.location.href = "/login?reason=session_expired";
      }
    }

    if (status === 403 && typeof window !== "undefined") {
      window.location.href = "/login?reason=unauthorized";
    }

    return Promise.reject(err);
  },
);

export default axiosInstance;
