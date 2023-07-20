const {hashPassword} = require('../utilities/bcrypt');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database')

async function createJob () {
    
}


module.exports = { createJob };
