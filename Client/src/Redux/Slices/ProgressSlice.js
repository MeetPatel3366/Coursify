import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helpers/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
  completedLectures: [],
  percentage: 0,
};

export const getCourseProgress = createAsyncThunk(
  "progress/getCourseProgress",
  async (courseId) => {
    try {
      const response = await toast.promise(
        axiosInstance.get(`/other/${courseId}`),
        {
          loading: "Fetching course progress",
          success: "Fetch course progress successfully",
          error: "Failed to fetch course progress",
        }
      );
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const markLectureAsCompleted = createAsyncThunk(
  "progress/markLectureCompleted",
  async (data) => {
    try {
      const response = await toast.promise(
        axiosInstance.patch(`/other/complete`, {
          courseId: data.courseId,
          lectureId: data.lectureId,
        }),
        {
          loading: "Marking lecture as completed...",
          success: "Lecture marked as completed!",
          error: "Failed to mark lecture as completed",
        }
      );
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(getCourseProgress.fulfilled, (state, action) => {
      state.completedLectures = action.payload.completedLectures || [];
      state.percentage = action.payload.percentage || 0;
    });

    builder.addCase(markLectureAsCompleted.fulfilled, (state, action) => {
      const updated = action.payload.progress;
      state.completedLectures = updated.completedLectures;
    });
  },
});

export default progressSlice.reducer;
