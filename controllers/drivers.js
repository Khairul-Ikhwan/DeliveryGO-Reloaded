const {hashPassword, comparePassword} = require('../utilities/bcrypt')
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { verifyToken, generateToken } = require('../utilities/jwt');


async function createDriver(req, res) {
  try {
    const { driverName, driverEmail, driverPhone, driverPfp, driverPassword } = req.body;
    const driverId = uuidv4();
    const hashedPassword = await hashPassword(driverPassword);
    const query = 'INSERT INTO public.drivers ("id", "driverName", "driverEmail", "driverPhone", "driverPfp", "driverPassword") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [driverId, driverName, driverEmail, driverPhone, driverPfp, hashedPassword];
    const result = await pool.query(query, values);
    const insertedDriver = result.rows[0];
    const token = generateToken(insertedDriver.id, 'driver');

    res.status(201).json({
      message: 'Driver created successfully',
      driver: insertedDriver,
      token: token
    });
  } catch (error) {
    console.error('Error creating driver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getAllDrivers(req, res) {
try {
  const query = 'SELECT * FROM drivers';
  const result = await pool.query(query);
  res.status(200).json({
    message: 'Fetch successfully',
    data: result.rows,
  });

} catch (error) {
  console.error('Error fetching drivers:', error);
  res.status(500).json({ error: 'Internal server error' });
}

}


async function findDriverById(req, res) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const accessToken = authorizationHeader.slice(7);
    const decoded = verifyToken(accessToken);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { driverId } = decoded;
    const query = 'SELECT * FROM drivers WHERE "id" = $1';
    const result = await pool.query(query, [driverId]);
    const driver = result.rows[0];

    if (driver) {
      res.status(200).json({
        message: 'Driver found',
        driver: driver
      });
    } else {
      res.status(404).json({
        message: 'Driver not found'
      });
    }
  } catch (error) {
    console.error('Error finding driver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function findDriver(req, res) {
  try {
    const { driverId } = req.params;

    const query = 'SELECT * FROM drivers WHERE "id" = $1';
    const result = await pool.query(query, [driverId]);
    const driver = result.rows[0];

    if (driver) {
      res.status(200).json({
        message: 'Driver found',
        driver: driver
      });
    } else {
      res.status(404).json({
        message: 'Driver not found'
      });
    }
  } catch (error) {
    console.error('Error finding driver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteDriverByEmail(req, res) {
  try {
    const { email } = req.body;
    const query = 'DELETE FROM drivers WHERE "driverEmail" = $1';
    const result = await pool.query(query, [email]);

    if (result.rowCount > 0) {
      res.status(200).json({
        message: 'Driver deleted successfully'
      });
    } else {
      res.status(404).json({
        message: 'Driver not found'
      });
    }
  } catch (error) {
    console.error('Error deleting driver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateDriverByEmail(req, res) {
  const { email, password, driverPhone, driverPfp } = req.body;

  try {
    const querySelect = 'SELECT * FROM drivers WHERE "driverEmail" = $1';
    const resultSelect = await pool.query(querySelect, [email]);
    const driver = resultSelect.rows[0];

    if (!driver) {
      return res.status(404).json({
        message: 'Driver not found'
      });
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await hashPassword(password);
    }

    let queryUpdate = 'UPDATE drivers SET ';
    const valuesUpdate = [];

    if (driverPhone !== undefined) {
      queryUpdate += `"driverPhone" = $1, `;
      valuesUpdate.push(driverPhone);
    }

    if (driverPfp !== undefined) {
      queryUpdate += `"driverPfp" = $${valuesUpdate.length + 1}, `;
      valuesUpdate.push(driverPfp);
    }

    if (hashedPassword) {
      queryUpdate += `"driverPassword" = $${valuesUpdate.length + 1}, `;
      valuesUpdate.push(hashedPassword);
    }

    queryUpdate = queryUpdate.slice(0, -2) + ` WHERE "driverEmail" = $${valuesUpdate.length + 1}`;
    valuesUpdate.push(email);

    try {
      await pool.query(queryUpdate, valuesUpdate);

      const queryFetchUpdated = 'SELECT * FROM drivers WHERE "driverEmail" = $1';
      const resultFetchUpdated = await pool.query(queryFetchUpdated, [email]);
      const updatedDriver = resultFetchUpdated.rows[0];

      return res.status(200).json({
        message: 'Driver updated successfully',
        driver: updatedDriver
      });
    } catch (error) {
      console.error('Error updating driver:', error);
      return res.status(500).json({ error: 'Error updating driver' });
    }
  } catch (error) {
    console.error('Error selecting driver:', error);
    return res.status(500).json({ error: 'Error selecting driver' });
  }
}


async function driverLogIn(req, res) {
  try {
    const { driverEmail, driverPassword } = req.body;
    const querySelect = 'SELECT * FROM drivers WHERE "driverEmail" = $1';
    const resultSelect = await pool.query(querySelect, [driverEmail]);
    const driver = resultSelect.rows[0];

    if (!driver) {
      return res.status(404).json({
        message: 'Driver not found'
      });
    }

    const isPasswordValid = await comparePassword(driverPassword, driver.driverPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid password'
      });
    }

    const token = generateToken(driver.id, 'driver');
    const { id, driverName, driverPhone, driverPfp } = driver;

    res.status(200).json({
      message: 'Driver logged in successfully',
      driver: {
        id,
        driverName,
        driverEmail,
        driverPhone,
        driverPfp
      },
      token: token
    });
  } catch (error) {
    console.error('Error logging in driver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function checkEmail(req, res) {
  try {
    const { driverEmail } = req.body;

    const query = 'SELECT * FROM drivers WHERE "driverEmail" = $1';
    const result = await pool.query(query, [driverEmail]);
    const driver = result.rows[0];

    if (driver) {
      res.status(200).json({
        message: 'Driver found',
        driver: driver
      });
    } else {
      //In this case we want both a 200
      res.status(200).json({
        message: 'Driver not found'
      });
    }
  } catch (error) {
    console.error('Error finding driver by email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}



module.exports = {
  createDriver,
  getAllDrivers,
  findDriverById,
  deleteDriverByEmail,
  updateDriverByEmail,
  driverLogIn,
  checkEmail,
  findDriver
}
