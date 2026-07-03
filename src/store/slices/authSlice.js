import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

const ENDPOINTS = {
  login: "/auth/admin/login",
  logout: "/auth/logout",
  me: "/auth/me",
};

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.me);
      return response.data.data; // { _id, name, email, role }
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
      return response.data.data.user;
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
      state.admin = null;
    },
    updateAdmin: (state, action) => {
      state.admin = { ...state.admin, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMe
      .addCase(fetchMe.pending, (state) => {
       if (!state.hasCheckedInitialAuth) {
          state.initializing = true;
        }
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.initializing = false;
        state.isAuthenticated = true;
        state.admin = action.payload;
        state.sessionExpired = false;
        state.hasCheckedInitialAuth = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.initializing = false;
        state.isAuthenticated = false;
        state.admin = null;
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
        state.isAuthenticated = true;
        state.admin = action.payload;
        state.error = null;
        state.sessionExpired = false;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // logoutAdmin
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
        state.error = null;
      })
      .addCase(logoutAdmin.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.admin = null;
      });
  },
});

export const { clearError, setSessionExpired, updateAdmin } = authSlice.actions;
export default authSlice.reducer;
