const {hashPassword, comparePassword} = require('../utilities/bcrypt');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database')
const {verifyToken , generateToken} = require('../utilities/jwt')

// Create User
async function createUser(req, res) {
  try {
    const { userName, userPassword, userPfp, userEmail, userPhone, userBlk, userStreet, userUnit, userPostal, userBuildingName, userStatus } = req.body;
    const userId = uuidv4();
    const hashedPassword = await hashPassword(userPassword);
    const query = 'INSERT INTO public.users ("id", "created_at", "userName", "userPassword", "userPfp", "userEmail", "userPhone", "userBlk", "userStreet", "userUnit", "userPostal", "userBuildingName", "userStatus") VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *';
    const values = [userId, userName, hashedPassword, userPfp, userEmail, userPhone, userBlk, userStreet, userUnit, userPostal, userBuildingName, userStatus];
    const result = await pool.query(query, values);
    const insertedUser = result.rows[0];
    const token = generateToken(userId, 'user');
    res.status(201).json({
      message: 'User created successfully',
      user: insertedUser,
      token: token
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function userLogIn(req, res) {
  try {
    const { userEmail, userPassword } = req.body;
    const querySelect = 'SELECT * FROM users WHERE "userEmail" = $1';
    const resultSelect = await pool.query(querySelect, [userEmail]);
    const user = resultSelect.rows[0];

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const isPasswordValid = await comparePassword(userPassword, user.userPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid password'
      });
    }

    const token = generateToken(user.id, 'user');
    const {
      id,
      userName,
      userPfp,
      userEmail: retrievedUserEmail,
      userPhone,
      userBlk,
      userStreet,
      userUnit,
      userPostal,
      userBuildingName,
      userStatus
    } = user;

    res.status(200).json({
      message: 'User logged in successfully',
      user: {
        id,
        userName,
        userPfp,
        userEmail: retrievedUserEmail,
        userPhone,
        userBlk,
        userStreet,
        userUnit,
        userPostal,
        userBuildingName,
        userStatus
      },
      token: token
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
    console.log(error)
  }
}

async function getUserDetails(req, res, pool) {
  try {
    const authorizationHeader = req.headers.authorization;
    let userId;

    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      const accessToken = authorizationHeader.slice(7);
      const decoded = verifyToken(accessToken);

      if (!decoded || !decoded.userId) {
        return res.status(401).json({ error: "Invalid or expired token." });
      }

      userId = decoded.userId;
    } else {
      userId = req.params.userId;

      if (!userId) {
        return res.status(401).json({ error: "Authorization token or user ID not found." });
      }
    }

    const query = 'SELECT * FROM users WHERE "id" = $1';
    const result = await pool.query(query, [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}






module.exports = { createUser, userLogIn, getUserDetails };
