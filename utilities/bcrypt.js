const bcrypt = require('bcrypt');
require('dotenv').config();

// Get the salt rounds from the environment variable
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);

// Function to hash a password
async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// Function to compare a password with a hashed password
async function comparePassword(password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}


module.exports = {
  hashPassword,
  comparePassword,
};
