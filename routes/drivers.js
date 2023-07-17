const driverCtrl = require('../controllers/drivers');
const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Route to create a driver
router.post('/create', (req, res) => {
  driverCtrl.createDriver(req, res, pool);
});

router.get('/all-drivers', (req, res) => {
  driverCtrl.getAllDrivers(req, res, pool);
});

router.get('/find-driver', (req, res) => {
    driverCtrl.findDriverByEmail(req, res, pool);
  });

router.delete('/delete', (req, res) => {
    driverCtrl.deleteDriverByEmail(req,res,pool)
})

router.patch('/update', (req, res) => {
    driverCtrl.updateDriverByEmail(req,res,pool)
})

module.exports = router;
