const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { createUser } = require('../controllers/users');


router.post('/create', (req, res) => {
    createUser(req, res, pool);
  });

module.exports = router;
