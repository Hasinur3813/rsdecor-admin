import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";
import { ADMIN_ROLES } from "@/lib/authConstants";

const ENDPOINTS = {
  login: "/auth/admin/login",
  logout: "/auth/logout",
  me: "/auth/me",
};

const isAdminRole = (role) => {
  if (!role) return false;
  return ADMIN_ROLES.includes(String(role).toLowerCase());
};

const sanitizeAdminPayload = (payload) => {
  if (!payload || typeof payload !== "object") return null;
  const allowed = ["_id", "id", "name", "email", "role", "avatar", "createdAt"];
  const clean = {};
  for (const key of allowed) {
    if (key in payload) clean[key] = payload[key];
  }
  if (payload.role) clean.role = String(payload.role).toLowerCase();
  return Object.keys(clean).length > 0 ? clean : null;
};

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.me);
      const raw = response.data?.data;
      const admin = sanitizeAdminPayload(raw);
      if (!admin || !isAdminRole(admin.role)) {
        return rejectWithValue("Unauthorized: admin role required");
      }
      return admin;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch user",
      );
    }
  },
);

export const loginAdmin = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.login, {
        email: String(email).trim().toLowerCase(),
        password,
      });
      const raw = response.data?.data?.user;
      const admin = sanitizeAdminPayload(raw);
      if (!admin || !isAdminRole(admin.role)) {
        return rejectWithValue("Access denied. Admin credentials required.");
      }
      return admin;
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
      // Ignore logout network errors; local session is cleared anyway
    }
    return true;
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    admin: null,
    isAuthenticated: false,
    hasValidRole: false,
    loading: false,
    initializing: true,
    error: null,
    sessionExpired: false,
    hasCheckedInitialAuth: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSessionExpired: (state) => {
      state.sessionExpired = true;
      state.isAuthenticated = false;
      state.hasValidRole = false;
      state.admin = null;
      state.error = null;
    },
    updateAdmin: (state, action) => {
      if (!state.admin) return;
      const updates = sanitizeAdminPayload({ ...state.admin, ...action.payload }) || state.admin;
      state.admin = updates;
      if (updates?.role) {
        state.hasValidRole = isAdminRole(updates.role);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMe
      .addCase(fetchMe.pending, (state) => {
        state.initializing = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.initializing = false;
        const admin = action.payload;
        const roleOk = isAdminRole(admin?.role);
        if (roleOk) {
          state.isAuthenticated = true;
          state.hasValidRole = true;
          state.admin = admin;
          state.sessionExpired = false;
          state.error = null;
        } else {
          state.isAuthenticated = false;
          state.hasValidRole = false;
          state.admin = null;
        }
        state.hasCheckedInitialAuth = true;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.initializing = false;
        state.isAuthenticated = false;
        state.hasValidRole = false;
        state.admin = null;
        if (action.payload?.includes?.("Unauthorized")) {
          state.sessionExpired = true;
        }
        state.hasCheckedInitialAuth = true;
      })
      // loginAdmin
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.sessionExpired = false;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const admin = action.payload;
        const roleOk = isAdminRole(admin?.role);
        if (roleOk) {
          state.isAuthenticated = true;
          state.hasValidRole = true;
          state.admin = admin;
          state.error = null;
          state.sessionExpired = false;
          state.hasCheckedInitialAuth = true;
        } else {
          state.isAuthenticated = false;
          state.hasValidRole = false;
          state.admin = null;
          state.error = "Access denied. Admin credentials required.";
        }
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.hasValidRole = false;
        state.admin = null;
        state.error = action.payload || "Authentication failed";
      })
      // logoutAdmin
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.hasValidRole = false;
        state.admin = null;
        state.error = null;
        state.sessionExpired = false;
        state.hasCheckedInitialAuth = true;
      })
      .addCase(logoutAdmin.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.hasValidRole = false;
        state.admin = null;
        state.hasCheckedInitialAuth = true;
      });
  },
});

export const { clearError, setSessionExpired, updateAdmin } = authSlice.actions;
export default authSlice.reducer;
