import AppError from "../utils/error.util.js";
import sendEmail from "../utils/sendEmail.js";

const contactUs = async (req, res, next) => {
  try {
    console.log(req.body);

    const { name, email, message } = req.body.userInput;
    console.log(name, email, message);

    if (!name || !email || !message) {
      return next(new AppError("All fields are required", 400));
    }

    const subject = "Contact Us Form";

    const textMessage = `${name} - ${email} <br/> ${message}`;

    await sendEmail(process.env.CONTACT_US_EMAIL, subject, textMessage);

    res.status(200).json({
      success: true,
      message: "your message has been submitted successfully",
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(error.message, 400));
  }
};

export { contactUs };
