const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const pool = require('../config/database');
dotenv.config();

//nodemailer: https://www.freecodecamp.org/news/use-nodemailer-to-send-emails-from-your-node-js-server/

async function sendEmail(email, htmlPath, emailSubject) {

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

async function findDriverNotify(jobID) {
  try {
    const findJobQuery = 'SELECT driver_id FROM jobs WHERE id = $1';
    const jobResult = await pool.query(findJobQuery, [jobID]);

    if (jobResult.rows.length === 0) {
      throw new Error('Job not found');
    }
    const driverID = jobResult.rows[0].driver_id;
    const findDriverQuery = 'SELECT "driverEmail" FROM drivers WHERE id = $1';
    const driverResult = await pool.query(findDriverQuery, [driverID]);

    if (driverResult.rows.length === 0) {
      throw new Error('Driver not found');
    }

    const driverEmail = driverResult.rows[0].driverEmail;

    return driverEmail;
  } catch (error) {
    console.error('Error finding driver email:', error);
    throw error; 
  }
}



module.exports = {
 sendEmail,
 findDriverNotify
}
