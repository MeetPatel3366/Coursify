import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") || false,
  role: localStorage.getItem("role") || "",
  data: localStorage.getItem("data") || {},
};

export const createAccount = createAsyncThunk("/auth/signup", async (data) => {
  try {
    const res = await toast.promise(axiosInstance.post("user/register", data), {
      loading: "Wait! Creating your account",
      success: (res) => res?.data?.message || "Account created successfully",
      error: (err) =>
        err?.response?.data?.message || "Failed to create account",
    });
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    throw error;
  }
});
export const login = createAsyncThunk("/auth/login", async (data) => {
  try {
    const res = await toast.promise(axiosInstance.post("user/login", data), {
      loading: "Wait! authentication in progress...",
      success: (res) => res?.data?.message || "Login successfully",
      error: (err) => err?.response?.data?.message || "Failed to login",
    });
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    throw error;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      localStorage.setItem("data", JSON.stringify(action?.payload?.user));
      localStorage.setItem("isLoggedIn", true);
      localStorage.setItem("role", action?.payload?.user?.role);
      state.isLoggedIn = true;
      state.data = action?.payload?.user;
      state.role = action?.payload?.user?.role;
    });
  },
});

// export const  = authSlice.actions;
export default authSlice.reducer;
