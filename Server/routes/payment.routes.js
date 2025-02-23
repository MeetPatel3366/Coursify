import { Router } from "express";

const router = Router();

router.get("/razorpay-key", getRazorpayApiKey);

router.post("/subscribe", buySubscription);

router.post("/verify", verifySubscription);

router.post("/unsubscribe", cancelSubscription);

router.get("/", allPayments);

export default router;
