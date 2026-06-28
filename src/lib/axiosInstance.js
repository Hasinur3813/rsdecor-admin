import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("rs_admin_token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err),
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("rs_admin_token");
      localStorage.removeItem("rs_admin_user");
      localStorage.removeItem("rs_admin_token_expiry");
      window.location.href = "/login?reason=session_expired";
    }

    if (status === 403 && typeof window !== "undefined") {
      window.location.href = "/login?reason=unauthorized";
    }

    return Promise.reject(err);
  },
);

export default axiosInstance;
