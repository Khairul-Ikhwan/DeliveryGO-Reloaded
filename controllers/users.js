const {hashPassword} = require('../utilities/bcrypt');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database')

// Create User
async function createUser(req, res) {
  try {
    const { userName, userPassword, userPfp, userEmail, userPhone, userBlk, userStreet, userUnit, userPostal, userBuildingName, userStatus } = req.body;

    // Generate a UUID for the user ID
    const userId = uuidv4();
    const hashedPassword = await hashPassword(userPassword);

    // DB Insert operation
    const query = 'INSERT INTO public.users ("id", "created_at", "userName", "userPassword", "userPfp", "userEmail", "userPhone", "userBlk", "userStreet", "userUnit", "userPostal", "userBuildingName", "userStatus") VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *';
    const values = [userId, userName, hashedPassword, userPfp, userEmail, userPhone, userBlk, userStreet, userUnit, userPostal, userBuildingName, userStatus];
    const result = await pool.query(query, values);

    const insertedUser = result.rows[0];

    res.status(201).json({
      message: 'User created successfully',
      user: insertedUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports = { createUser };
