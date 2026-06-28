import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

const ENDPOINTS = {
  login: "/admin/auth/login",
  logout: "/admin/auth/logout",
  me: "/admin/auth/me",
};

const TOKEN_TTL = 8 * 60 * 60 * 1000;

export const loginAdmin = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.login, {
        email: String(email).trim().toLowerCase(),
        password,
      });

      const { token, admin } = response.data;
      const expiry = Date.now() + TOKEN_TTL;

      if (typeof window !== "undefined") {
        localStorage.setItem("rs_admin_token", token);
        localStorage.setItem("rs_admin_user", JSON.stringify(admin));
        localStorage.setItem("rs_admin_token_expiry", String(expiry));
      }

      return { token, admin, expiry };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please try again.",
      );
    }
  },
);

export const logoutAdmin = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      if (typeof window !== "undefined") {
        await axiosInstance.post(ENDPOINTS.logout);
      }
    } catch (err) {
      // Ignore logout network errors; clear local session anyway.
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("rs_admin_token");
        localStorage.removeItem("rs_admin_user");
        localStorage.removeItem("rs_admin_token_expiry");
      }
    }
    return true;
  },
);

const loadFromStorage = () => {
  if (typeof window === "undefined")
    return { admin: null, token: null, valid: false };
  try {
    const token = localStorage.getItem("rs_admin_token");
    const user = localStorage.getItem("rs_admin_user");
    const expiry = localStorage.getItem("rs_admin_token_expiry");

    if (!token || !user || !expiry)
      return { admin: null, token: null, valid: false };
    if (Date.now() > Number(expiry)) {
      localStorage.removeItem("rs_admin_token");
      localStorage.removeItem("rs_admin_user");
      localStorage.removeItem("rs_admin_token_expiry");
      return { admin: null, token: null, valid: false };
    }

    return { admin: JSON.parse(user), token, valid: true };
  } catch {
    return { admin: null, token: null, valid: false };
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    admin: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    initializing: true,
    error: null,
    sessionExpired: false,
  },
  reducers: {
    initAuth: (state) => {
      const { admin, token, valid } = loadFromStorage();
      state.admin = valid ? admin : null;
      state.token = valid ? token : null;
      state.isAuthenticated = valid;
      state.initializing = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSessionExpired: (state) => {
      state.sessionExpired = true;
      state.isAuthenticated = false;
      state.admin = null;
      state.token = null;
    },
    updateAdmin: (state, action) => {
      state.admin = { ...state.admin, ...action.payload };
      if (typeof window !== "undefined") {
        localStorage.setItem("rs_admin_user", JSON.stringify(state.admin));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.sessionExpired = false;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.admin = action.payload.admin;
        state.token = action.payload.token;
        state.error = null;
        state.sessionExpired = false;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutAdmin.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
        state.token = null;
      });
  },
});

export const { initAuth, clearError, setSessionExpired, updateAdmin } =
  authSlice.actions;
export default authSlice.reducer;
