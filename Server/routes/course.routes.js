import { Router } from "express";
import {
  addLectureToCourse,
  createCourse,
  getAllCourses,
  getLecturesByCourseId,
  removeCourse,
  removeLecture,
  updateCourse,
} from "../controllers/course.controller.js";
import { authorizedRoles, isLoggedIn } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = new Router();

router.get("/", getAllCourses);

router.get("/:id", isLoggedIn, getLecturesByCourseId);

router.post(
  "/",
  isLoggedIn,
  authorizedRoles("ADMIN"),
  upload.single("thumbnail"),
  createCourse
);

router.put("/:id", isLoggedIn, authorizedRoles("ADMIN"), updateCourse);

router.delete("/:id", isLoggedIn, authorizedRoles("ADMIN"), removeCourse);

router.post(
  "/:id",
  isLoggedIn,
  authorizedRoles("ADMIN"),
  upload.single("lecture"),
  addLectureToCourse
);

router.delete(
  "/:courseId/lecture/:lectureId",
  isLoggedIn,
  authorizedRoles("ADMIN"),
  removeLecture
);

export default router;
