const driverCtrl = require('../controllers/drivers');
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Route to create a driver
router.post('/create', (req, res) => {
  driverCtrl.createDriver(req, res, pool);
});

// Route to display all drivers
router.get('/all-drivers', (req, res) => {
  driverCtrl.getAllDrivers(req, res, pool);
});

// Route to find a driver by email
router.get('/find-driver', (req, res) => {
    driverCtrl.findDriverByEmail(req, res, pool);
  });

// Route to unalive a driver
router.delete('/delete', (req, res) => {
    driverCtrl.deleteDriverByEmail(req,res,pool)
})

// Route to update driver details, you need the email tho
router.patch('/update', (req, res) => {
    driverCtrl.updateDriverByEmail(req,res,pool)
})

module.exports = router;
