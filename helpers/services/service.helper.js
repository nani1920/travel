/** @format */

require("dotenv").config();
const nodemailer = require("nodemailer");
const env = process.env;

const transporter = nodemailer.createTransport({
  service: env.EMAIL_SERVICE, // Example for Gmail, use your email provider's service
  auth: {
    user: env.EMAIL_USER,
    pass: env.PASS_KEY,
  },
});

class Service {
  async sendEmailNotification(receiverEmail, sender, content) {
    const mailOptions = {
      from: "your-email@gmail.com",
      to: receiverEmail,
      subject: "OTP Verification",
      text: `${sender} sent you a message: ${content}`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      // console.log("Email sent:", info.response);
    } catch (err) {
      // console.log("Error sending email:", err);
    }
  }
}
module.exports = new Service();
