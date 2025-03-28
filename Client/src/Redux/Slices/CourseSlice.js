import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
  courseData: [],
};

export const getAllCourses = createAsyncThunk("/course/get", async () => {
  try {
    const res = await toast.promise(axiosInstance.get("/courses"), {
      loading: "loading course data ...",
      success: "Courses loaded successfully",
      error: "Failed to get the courses",
    });
    return res.data.courses;
  } catch (error) {
    toast.error(error?.res?.data.message);
  }
});

export const createNewCourse = createAsyncThunk(
  "/course/create",
  async (data) => {
    try {
      let formData = new FormData();
      formData.append("title", data?.title);
      formData.append("description", data?.description);
      formData.append("category", data?.category);
      formData.append("createdBy", data?.createdBy);
      formData.append("thumbnail", data?.thumbnail);

      const res = await toast.promise(
        axiosInstance.post("/courses", formData),
        {
          loading: "creating new course ...",
          success: "Course created successfully",
          error: "Failed to create course",
        }
      );
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

export const deleteCourse = createAsyncThunk("/course/delete", async () => {
  try {
    const res = await toast.promise(axiosInstance.delete(`/courses/${id}`), {
      loading: "deleting course ...",
      success: "Course deleted successfully",
      error: "Failed to delete course",
    });
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
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
