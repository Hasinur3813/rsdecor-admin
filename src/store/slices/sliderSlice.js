import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axiosInstance";

const ENDPOINTS = {
  base: "/sliders",
  byId: (id) => `/sliders/${id}`,
};

// ── Async Thunks ──────────────────────────────────────────────────────────────

export const fetchSliders = createAsyncThunk(
  "slider/fetchSliders",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.base, { params });
      return response.data; // { data, pagination, count }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch sliders",
      );
    }
  },
);

export const fetchSliderById = createAsyncThunk(
  "slider/fetchSliderById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(ENDPOINTS.byId(id));
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch slider",
      );
    }
  },
);

export const createSlider = createAsyncThunk(
  "slider/createSlider",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(ENDPOINTS.base, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to create slider",
      );
    }
  },
);

export const updateSlider = createAsyncThunk(
  "slider/updateSlider",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(ENDPOINTS.byId(id), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to update slider",
      );
    }
  },
);

export const deleteSlider = createAsyncThunk(
  "slider/deleteSlider",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(ENDPOINTS.byId(id));
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to delete slider",
      );
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const sliderSlice = createSlice({
  name: "slider",
  initialState: {
    // List
    sliders: [],
    totalSliders: 0,
    activeSliders: 0,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPrevPage: false,
    },
    fetchLoading: false,
    fetchError: null,

    // Single slider (for edit / detail view)
    currentSlider: null,
    detailLoading: false,
    detailError: null,

    // Create
    createLoading: false,
    createError: null,
    createSuccess: false,

    // Update
    updateLoading: false,
    updateError: null,
    updateSuccess: false,

    // Delete
    deleteLoading: false,
    deleteError: null,
    deleteSuccess: false,
  },
  reducers: {
    clearSliderErrors: (state) => {
      state.fetchError = null;
      state.detailError = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    resetCreateState: (state) => {
      state.createLoading = false;
      state.createError = null;
      state.createSuccess = false;
    },
    resetUpdateState: (state) => {
      state.updateLoading = false;
      state.updateError = null;
      state.updateSuccess = false;
    },
    resetDeleteState: (state) => {
      state.deleteLoading = false;
      state.deleteError = null;
      state.deleteSuccess = false;
    },
    clearCurrentSlider: (state) => {
      state.currentSlider = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch All ─────────────────────────────────────────────────────
      .addCase(fetchSliders.pending, (state) => {
        state.fetchLoading = true;
        state.fetchError = null;
      })
      .addCase(fetchSliders.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.sliders = action.payload.data;
        state.totalSliders = action.payload.totalSliders || 0;
        state.activeSliders = action.payload.activeSliders || 0;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchSliders.rejected, (state, action) => {
        state.fetchLoading = false;
        state.fetchError = action.payload || "Unable to fetch sliders";
      })

      // ── Fetch By Id ───────────────────────────────────────────────────
      .addCase(fetchSliderById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.currentSlider = null;
      })
      .addCase(fetchSliderById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentSlider = action.payload;
      })
      .addCase(fetchSliderById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload || "Unable to fetch slider";
      })

      // ── Create ────────────────────────────────────────────────────────
      .addCase(createSlider.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createSlider.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        state.sliders.unshift(action.payload);
      })
      .addCase(createSlider.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || "Unable to create slider";
        state.createSuccess = false;
      })

      // ── Update ────────────────────────────────────────────────────────
      .addCase(updateSlider.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateSlider.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        const idx = state.sliders.findIndex(
          (s) => String(s.id || s._id) === String(action.payload.id || action.payload._id),
        );
        if (idx !== -1) state.sliders[idx] = action.payload;
        state.currentSlider = action.payload;
      })
      .addCase(updateSlider.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || "Unable to update slider";
        state.updateSuccess = false;
      })

      // ── Delete ────────────────────────────────────────────────────────
      .addCase(deleteSlider.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteSlider.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteSuccess = true;
        state.sliders = state.sliders.filter(
          (s) => String(s.id || s._id) !== String(action.payload),
        );
      })
      .addCase(deleteSlider.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || "Unable to delete slider";
        state.deleteSuccess = false;
      });
  },
});

export const {
  clearSliderErrors,
  resetCreateState,
  resetUpdateState,
  resetDeleteState,
  clearCurrentSlider,
} = sliderSlice.actions;

export default sliderSlice.reducer;
