const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const jobsCtrl = require('../controllers/jobs');


router.post('/create', (req, res) => {
    jobsCtrl.createUser(req, res, pool);
  });



module.exports = router;