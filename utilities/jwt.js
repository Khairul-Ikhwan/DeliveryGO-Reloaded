const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_KEY

function generateToken(id, userType) {
  const payload = {
    [`${userType}Id`]: id
  };

  const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });
  return token;
}


function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken
};
