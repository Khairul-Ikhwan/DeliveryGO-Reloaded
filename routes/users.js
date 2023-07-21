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


module.exports = router;
