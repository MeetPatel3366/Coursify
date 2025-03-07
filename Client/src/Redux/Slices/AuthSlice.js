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
    const res = await toast.promise(
      axiosInstance.post("user/register", data),
      {
        loading: "Wait! Creating your account",
        success: (res) => res?.data?.message || "Account created successfully",
        error: (err) => err?.response?.data?.message || "Failed to create account",
      }
    );
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
});

// export const  = authSlice.actions;
export default authSlice.reducer;
