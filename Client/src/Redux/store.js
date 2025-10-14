import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./Slices/AuthSlice";
import courseSliceReducer from "./Slices/CourseSlice";
import razorpaySliceReducer from "./Slices/RazorpaySlice";
import lectureSliceReducer from "./Slices/LectureSlice";
import statSliceReducer from "./Slices/StatSlice";
import progressSliceReducer from "./Slices/ProgressSlice";
import rateLimitReducer from "./Slices/rateLimitSlice";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    course: courseSliceReducer,
    razorpay: razorpaySliceReducer,
    lecture: lectureSliceReducer,
    stat: statSliceReducer,
    progress: progressSliceReducer,
    rateLimit: rateLimitReducer,
  },
  devTools: true,
});

export default store;
