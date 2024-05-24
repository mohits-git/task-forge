import nodemailer from "nodemailer";

const gmail = process.env.APP_GMAIL;
const pass = process.env.APP_GMAIL_PASSWORD;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmail,
    pass: pass,
  }
});

export const mailOptions = {
  from: gmail,
};
