import { Router } from "express";
import {
  createCourse,
  getAllCourses,
  getLecturesByCourseId,
} from "../controllers/course.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = new Router();

router.get("/", getAllCourses);

router.get("/:id", isLoggedIn, getLecturesByCourseId);

router.post("/", upload.single("thumbnail"), createCourse);

export default router;
