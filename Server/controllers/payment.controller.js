import User from "../models/user.model";
import { razorpay } from "../server";
import AppError from "../utils/error.util";

//get the Razorpay API key & this key is needed on the frontend to initialize payments
const getRazorpayApiKey = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Razorpay API key",
    key: process.env.RAZORPAY_KEY_ID,
  });
};

const buySubscription = async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError("Unauthorized, please login", 401));
  }

  if (user.role === "ADMIN") {
    return next(new AppError("Admin cannot purchase a subscription", 400));
  }

  // Create a new subscription using Razorpay
  const subscription = await razorpay.subscriptions.create({
    plan_id: process.env.RAZORPAY_PLAN_ID,
    customer_notify: 1,
  });

  user.subscription.id = subscription.id;
  user.subscription.status = subscription.status;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Subscribed Successfully",
    subscription_id: subscription.id,
  });
};

export { getRazorpayApiKey, buySubscription };
