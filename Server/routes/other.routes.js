import { Router } from "express";
import { contactUs } from "../controllers/other.controller.js";

const router = Router();

router.post("/contact", contactUs);

export default router;
