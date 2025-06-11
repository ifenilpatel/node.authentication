import transporter from '../config/email.config.js';

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: `no-reply <${process.env.GMAIL_AUTH_EMAIL}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

export default sendEmail;
