import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
  courseData: [],
};

export const getAllCourses = createAsyncThunk("/course/get", async () => {
  try {
    const res = await toast.promise(axiosInstance.get("/courses"), {
      loading: "loading course data",
      success: "Courses loaded successfully",
      error: "Failed to get the courses",
    });
    return res.data.courses;
  } catch (error) {
    toast.error(error?.res?.data.message);
  }
});

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: [],
  extraReducers: (builder) => {
    builder.addCase(getAllCourses.fulfilled, (state, action) => {
      if (action.payload) {
        console.log(action.payload);
        state.courseData = [...action.payload];
      }
    });
  },
});

export default courseSlice.reducer;
