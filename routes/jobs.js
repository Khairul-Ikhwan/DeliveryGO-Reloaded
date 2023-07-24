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

  router.get('/driverJobs', (req, res) => {
    jobsCtrl.driverJobs(req, res, pool);
  });

  router.get('/userJobs', (req, res) => {
    jobsCtrl.userJobs(req, res, pool);
  });

  router.get('/driverComplete', (req, res) => {
    jobsCtrl.driverCompleteJobs(req, res, pool);
  });

  router.get('/findCustomer', (req, res) => {
    jobsCtrl.findCustomer(req, res, pool);
  });

  router.post('/complete', (req, res) => {
    jobsCtrl.complete(req, res, pool);
  });


module.exports = router;