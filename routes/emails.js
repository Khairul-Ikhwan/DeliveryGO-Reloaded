const emailCtrl = require('../controllers/emails');
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

router.post('/sendEmail', async (req, res) => {
    const { email, subject, htmlPath } = req.body;
  
    const emailSent = await emailCtrl.sendEmail(email, htmlPath, subject);
  
    if (emailSent) {
      res.status(200).json({ message: 'Email sent successfully' });
    } else {
      res.status(500).json({ message: 'Error sending email' });
    }
  });

  router.post('/notifyDriver', async (req, res) => {
    try {
      const { jobID } = req.body;
      const driverEmail = await emailCtrl.findDriverNotify(jobID);
  
      res.status(200).json({ driverEmail });
    } catch (error) {
      res.status(500).json({ message: 'Error finding driver email', error: error.message });
    }
  });

module.exports = router;
