import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_AUTH_EMAIL,
    pass: process.env.GMAIL_AUTH_PASSWORD,
  },
});

export default transporter;
