import { Router } from "express";
import { contactUs, userStats } from "../controllers/other.controller.js";
import { authorizedRoles, isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/contact", contactUs);

router.get(
  "/admin/stats/users",
  isLoggedIn,
  authorizedRoles("ADMIN"),
  userStats
);

export default router;
