import nodemailer from "nodemailer";
import { config } from "dotenv";
config();

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASSWORD,
  },
});

var mailOptions = {
  from: "squealer@noreply.com",
  to: "mail",
  subject: "Sending Email using Node.js",
  text: "That was easy!",
};

export function sendMail() {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
