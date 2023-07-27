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

async function updateUser(req, res) {
  const { userEmail, userPhone, userPfp, userPassword } = req.body;

  // Extract the token from the Authorization header
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const accessToken = authorizationHeader.slice(7);
  const decoded = verifyToken(accessToken);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Extract the userId from the decoded token
  const { userId } = decoded;

  try {
    let hashedPassword;
    if (userPassword) {
      hashedPassword = await hashPassword(userPassword);
    }

    let queryUpdate = 'UPDATE users SET ';
    const valuesUpdate = [];
    const updates = [];

    if (userEmail !== undefined) {
      updates.push(`"userEmail" = $${updates.length + 1}`);
      valuesUpdate.push(userEmail);
    }

    if (userPhone !== undefined) {
      updates.push(`"userPhone" = $${updates.length + 1}`);
      valuesUpdate.push(userPhone);
    }

    if (userPfp !== undefined) {
      updates.push(`"userPfp" = $${updates.length + 1}`);
      valuesUpdate.push(userPfp);
    }

    if (hashedPassword) {
      updates.push(`"userPassword" = $${updates.length + 1}`);
      valuesUpdate.push(hashedPassword);
    }

    if (updates.length > 0) {
      queryUpdate += updates.join(', ') + ` WHERE "id" = $${valuesUpdate.length + 1}`;
      valuesUpdate.push(userId);
    } else {
      // Handle the case where there are no updates to make
      return res.status(400).json({ message: 'No updates to make' });
    }

    try {
      await pool.query(queryUpdate, valuesUpdate);

      const queryFetchUpdated = 'SELECT * FROM users WHERE "id" = $1';
      const resultFetchUpdated = await pool.query(queryFetchUpdated, [userId]);
      const updatedUser = resultFetchUpdated.rows[0];

      return res.status(200).json({
        message: 'User updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ error: 'Error updating user' });
    }
  } catch (error) {
    console.error('Error selecting user:', error);
    return res.status(500).json({ error: 'Error selecting user' });
  }
}







module.exports = { createUser, userLogIn, getUserDetails, updateUser };
