//get the Razorpay API key & this key is needed on the frontend to initialize payments
const getRazorpayApiKey = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Razorpay API key",
    key: process.env.RAZORPAY_KEY_ID,
  });
};

export { getRazorpayApiKey };
