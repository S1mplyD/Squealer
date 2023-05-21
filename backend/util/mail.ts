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

export async function sendMail(token: string, mail: string) {
  let mailOptions = {
    from: "squealer@noreply.com",
    to: mail,
    subject: "Password reset",
    html: `<h1>Reset passoword</h1><br><p>Your password reset token is ${token}</p>`,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
