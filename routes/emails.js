const emailCtrl = require('../controllers/emails');
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.post('/sendEmail', async (req, res) => {
    const { email, subject, htmlPath } = req.body;
  
    // Call your signUpDriver function with the email, subject, and htmlPath from the request body
    const emailSent = await emailCtrl.sendEmail(email, htmlPath, subject);
  
    if (emailSent) {
      res.status(200).json({ message: 'Email sent successfully' });
    } else {
      res.status(500).json({ message: 'Error sending email' });
    }
  });

module.exports = router;
