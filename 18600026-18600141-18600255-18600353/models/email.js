const nodemailer = require('nodemailer');

async function sendEmail(to, subject, text, html,attachments) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER|| "phamchibaolx3@gmail.com",
      pass: process.env.EMAIL_PASSWORD || "chibao123456789",
    },
  });

  const info = await transporter.sendMail({
    from: `"Cinema" <${process.env.EMAIL_USER}>`, 
    to, 
    subject,
    text, 
    html,
    attachments
  });

  return info;
}

module.exports = sendEmail;
