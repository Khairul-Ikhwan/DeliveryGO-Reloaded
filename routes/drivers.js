const express = require('express');
const router = express.Router();
const { createDriver } = require('../controllers/drivers');

// Route to create a driver
router.post('/create', createDriver);

module.exports = router;
