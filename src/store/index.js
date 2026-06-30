import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import sliderReducer from "./slices/sliderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    slider: sliderReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
