import nodemailer from "nodemailer";

// Function to send an email using nodemailer
const sendEmail = async function (email, subject, message) {
  // Create a transporter object with SMTP configuration
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // SMTP host address
    port: process.env.SMTP_PORT, // SMTP port number
    secure: false, // Use true for port 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME, // SMTP authentication username
      pass: process.env.SMTP_PASSWORD, // SMTP authentication password
    },
  });

  // Sending the email with the defined transport configuration
  await transporter.sendMail({
    from: process.env.SMTP_FROM_EMAIL, // Sender's email address
    to: email, // Receiver's email address
    subject: subject, // Email subject line
    html: message, // Email content in HTML format
  });
};

export default sendEmail;
