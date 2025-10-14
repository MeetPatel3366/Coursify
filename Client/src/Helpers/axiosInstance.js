import axios from "axios";
import toast from "react-hot-toast";
import store from "../Redux/store"; // adjust if your store path is different
import { setCooldown } from "../Redux/Slices/rateLimitSlice";

const BASE_URL = `http://localhost:5001/api/v1`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Global response interceptor for handling 429 Too Many Requests
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 429) {
      const retryAfter = parseInt(error.response.headers["retry-after"]) || 0;

      toast.error(
        retryAfter
          ? `Too many requests. Try again in ${retryAfter} seconds.`
          : "Too many requests. Please try again later."
      );

      if (retryAfter > 0) {
        store.dispatch(setCooldown(retryAfter));
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
