const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const userCtrl = require('../controllers/users');


router.post('/create', (req, res) => {
    userCtrl.createUser(req, res, pool);
  });

router.post('/login', (req, res) => {
  userCtrl.userLogIn(req, res, pool)
})

router.get('/getUser/:userId', (req, res) => {
  const userId = req.params.userId;
  userCtrl.getUserDetails(req, res, pool, userId);
});

router.post('/getUser', (req, res) => {
  userCtrl.getUserDetails(req, res, pool);
});

router.post('/update', (req, res) => {
  userCtrl.updateUser(req, res, pool);
});


module.exports = router;
