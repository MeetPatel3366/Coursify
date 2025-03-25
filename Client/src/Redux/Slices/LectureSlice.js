import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
  lectures: [],
};

export const getCourseLectures = createAsyncThunk(
  "/course/lecture/get",
  async (courseId) => {
    try {
      const response = await toast.promise(
        axiosInstance.get(`/courses/${courseId}`),
        {
          loading: "Fetching course lecture",
          success: "Lectures fetched successfully",
          error: "Failed to laod the lectures",
        }
      );
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const addCourseLectures = createAsyncThunk(
  "/course/lecture/add",
  async (data) => {
    try {
      const formData = new FormData();
      formData.append("lecture", data.lecture);
      formData.append("title", data.title);
      formData.append("description", data.description);

      const response = await toast.promise(
        axiosInstance.post(`/courses/${data.id}`, formData),
        {
          loading: "adding course lecture",
          success: "Lectures added successfully",
          error: "Failed to add the lectures",
        }
      );
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const deleteCourseLecture = createAsyncThunk(
  "/course/lecture/delete",
  async (data) => {
    try {
      const response = await toast.promise(
        axiosInstance.delete(
          `/courses?courseId=${data.courseId}&lectureId=${data.lectureId}`
        ),
        {
          loading: "deleting course lecture",
          success: "Lectures deleted successfully",
          error: "Failed to delete the lectures",
        }
      );
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

const lectureSlice = createSlice({
  name: "lecture",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCourseLectures.fulfilled, (state, action) => {
        state.lectures = action?.payload?.lectures;
      })
      .addCase(addCourseLectures.fulfilled, (state, action) => {
        state.lectures = action?.payload?.course?.lectures;
      });
  },
});

export default lectureSlice.reducer;
