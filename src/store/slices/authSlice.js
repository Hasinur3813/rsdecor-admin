import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const ENDPOINTS = {
  login:  "/admin/auth/login",
  logout: "/admin/auth/logout",
  me:     "/admin/auth/me",
};

const TOKEN_TTL = 8 * 60 * 60 * 1000;

const DEMO_USER = {
  id:    1,
  name:  "Md. Rasel Khandaker",
  email: "admin@rswallpaper.com",
  role:  "super_admin",
  phone: "01772-132818",
};

const DEMO_EMAIL    = "admin@rswallpaper.com";
const DEMO_PASSWORD = "Admin@1234";

export const loginAdmin = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await new Promise(r => setTimeout(r, 1400));

      if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
        return rejectWithValue(
          "Invalid email or password. Please check your credentials."
        );
      }

      const token  = "rs-admin-demo-jwt-" + Date.now();
      const expiry = Date.now() + TOKEN_TTL;
      const admin  = DEMO_USER;

      localStorage.setItem("rs_admin_token",        token);
      localStorage.setItem("rs_admin_user",         JSON.stringify(admin));
      localStorage.setItem("rs_admin_token_expiry", String(expiry));

      return { token, admin, expiry };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(r => setTimeout(r, 300));

      localStorage.removeItem("rs_admin_token");
      localStorage.removeItem("rs_admin_user");
      localStorage.removeItem("rs_admin_token_expiry");
      return true;
    } catch (err) {
      localStorage.removeItem("rs_admin_token");
      localStorage.removeItem("rs_admin_user");
      localStorage.removeItem("rs_admin_token_expiry");
      return true;
    }
  }
);

const loadFromStorage = () => {
  if (typeof window === "undefined") return { admin: null, token: null, valid: false };
  try {
    const token  = localStorage.getItem("rs_admin_token");
    const user   = localStorage.getItem("rs_admin_user");
    const expiry = localStorage.getItem("rs_admin_token_expiry");

    if (!token || !user || !expiry) return { admin: null, token: null, valid: false };
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
    admin:           null,
    token:           null,
    isAuthenticated: false,
    loading:         false,
    initializing:    true,
    error:           null,
    sessionExpired:  false,
  },
  reducers: {
    initAuth: (state) => {
      const { admin, token, valid } = loadFromStorage();
      state.admin           = valid ? admin : null;
      state.token           = valid ? token : null;
      state.isAuthenticated = valid;
      state.initializing    = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSessionExpired: (state) => {
      state.sessionExpired  = true;
      state.isAuthenticated = false;
      state.admin           = null;
      state.token           = null;
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
        state.error   = null;
        state.sessionExpired = false;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading         = false;
        state.isAuthenticated = true;
        state.admin           = action.payload.admin;
        state.token           = action.payload.token;
        state.error           = null;
        state.sessionExpired  = false;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading         = false;
        state.isAuthenticated = false;
        state.admin           = null;
        state.token           = null;
        state.error           = null;
      })
      .addCase(logoutAdmin.rejected, (state) => {
        state.loading         = false;
        state.isAuthenticated = false;
        state.admin           = null;
        state.token           = null;
      });
  },
});

export const { initAuth, clearError, setSessionExpired, updateAdmin } = authSlice.actions;
export default authSlice.reducer;
