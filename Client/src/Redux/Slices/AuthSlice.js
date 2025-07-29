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
export const verifyEmail = createAsyncThunk("/auth/verify", async (data) => {
  try {
    const res = await toast.promise(
      axiosInstance.get(`user/verify/${data.token}`),
      {
        loading: "Wait! verify your email...",
        success: (res) => res?.data?.message || "Email Verified Successfully!",
        error: (err) =>
          err?.response?.data?.message || "Failed to create account",
      }
    );
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

export const forgotPassword = createAsyncThunk(
  "/user/forgotPassword",
  async (email) => {
    try {
      const res = await toast.promise(
        axiosInstance.post("user/forgot-password", { email }),
        {
          loading: "Loading...",
          success: (data) => {
            console.log("fp data: ", data);

            return data?.data?.message;
          },
          error: "Failed to send verification email",
        }
      );

      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "/user/reset-password",
  async (data) => {
    try {
      const res = await toast.promise(
        axiosInstance.post(`/user/reset-password/${data.resetToken}`, {
          password: data.password,
        }),
        {
          loading: "Resetting...",
          success: (data) => {
            return data?.data?.message;
          },
          error: "Failed to reset passoword",
        }
      );

      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "/user/changePassoword",
  async (userPassword) => {
    try {
      let res = await toast.promise(
        axiosInstance.post("user/change-password", userPassword),
        {
          loading: "Loading in changing password...",
          success: (data) => {
            return data?.data?.message;
          },
          error: "Failed to change password",
        }
      );
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

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
