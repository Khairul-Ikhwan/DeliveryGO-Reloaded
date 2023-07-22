const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const jobsCtrl = require('../controllers/jobs');


router.post('/create', (req, res) => {
    jobsCtrl.createJob(req, res, pool);
  });

  router.post('/assign', (req, res) => {
    jobsCtrl.assignDriver(req, res, pool);
  });

  router.post('/getDistance', (req, res) => {
    jobsCtrl.getDistAndPrice(req, res, pool);
  });

  router.get('/getJobs', (req, res) => {
    jobsCtrl.getJobs(req, res, pool);
  });

module.exports = router;