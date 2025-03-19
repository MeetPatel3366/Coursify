import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") || false,
  role: localStorage.getItem("role") || "",
  data:
    localStorage.getItem("data") != undefined
      ? JSON.parse(localStorage.getItem("data"))
      : {},
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

export const logout = createAsyncThunk("/auth/logout", async () => {
  try {
    const res = await toast.promise(axiosInstance.get("user/logout"), {
      loading: "Wait! logout in progress...",
      success: (res) => res?.data?.message || "Logout successfully",
      error: (err) => err?.response?.data?.message || "Failed to logout",
    });
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    throw error;
  }
});

export const updateProfile = createAsyncThunk(
  "/user/update/profile",
  async ({ data }) => {
    try {
      console.log("Updating profile for ID:", id);
      console.log("Form Data:", data);
      const res = await toast.promise(axiosInstance.put(`user/update`, data), {
        loading: "Wait! profile update in progress...",
        success: (res) => res?.data?.message || "Update Profile Successfully",
        error: (err) =>
          err?.response?.data?.message || "Failed to update profile",
      });
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      throw error;
    }
  }
);

export const getUserData = createAsyncThunk("/user/details", async () => {
  try {
    const res = await axiosInstance.get("user/me");
    return res.data;
  } catch (error) {
    toast.error(error?.message);
    throw error;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        localStorage.setItem("data", JSON.stringify(action?.payload?.user));
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", action?.payload?.user?.role);
        state.isLoggedIn = true;
        state.data = action?.payload?.user;
        state.role = action?.payload?.user?.role;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.isLoggedIn = false;
        state.data = {};
        state.role = "";
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        if (!action?.payload?.user) return;
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
