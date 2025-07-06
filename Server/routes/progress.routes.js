import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
  getProgress,
  markLectureCompleted,
} from "../controllers/progress.controller.js";

const router = express.Router();

router.patch("/complete", isLoggedIn, markLectureCompleted);

router.get("/:courseId", isLoggedIn, getProgress);

export default router;