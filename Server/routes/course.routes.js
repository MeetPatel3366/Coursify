import { Router } from "express";
import {
  createCourse,
  getAllCourses,
  getLecturesByCourseId,
  removeCourse,
  updateCourse,
} from "../controllers/course.controller.js";
import { authorizedRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = new Router();

router.get("/", getAllCourses);

router.get("/:id", isLoggedIn, getLecturesByCourseId);

router.post("/", isLoggedIn, authorizedRoles("ADMIN"), upload.single("thumbnail"), createCourse);

router.put("/:id", isLoggedIn, authorizedRoles("ADMIN"), updateCourse);

router.delete("/:id", isLoggedIn, authorizedRoles("ADMIN"), removeCourse);

export default router;
