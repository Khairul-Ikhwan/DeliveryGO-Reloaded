const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path')
dotenv.config();

//nodemailer: https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/

async function sendEmail(email, htmlPath, emailSubject) {
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: emailUser,
      pass: emailPassword,
    },
  });

  const emailTemplate = fs.readFileSync(htmlPath, 'utf-8');
  const mailOptions = {
    from:'"DeliveryGO Team" <' + emailUser + '>',
    to: email,
    subject: emailSubject,
    html: emailTemplate,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}




module.exports = {
 sendEmail,
}
