const {hashPassword} = require('../utilities/bcrypt')
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

async function createDriver(req, res) {
  try {
    const { driverName, driverEmail, driverPhone, driverPfp, driverPassword } = req.body;
    // UUID cos fancy
    const driverId = uuidv4();
    const hashedPassword = await hashPassword(driverPassword);
    // DB Insert op
    const query = 'INSERT INTO public.drivers ("id", "driverName", "driverEmail", "driverPhone", "driverPfp", "driverPassword") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [driverId, driverName, driverEmail, driverPhone, driverPfp, hashedPassword];
    const result = await pool.query(query, values);
    const insertedDriver = result.rows[0];
    res.status(201).json({
      message: 'Driver created successfully',
      driver: insertedDriver
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


async function findDriverByEmail(req, res) {
  try {
    const { email } = req.body;
    const query = 'SELECT * FROM drivers WHERE "driverEmail" = $1';
    const result = await pool.query(query, [email]);
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








module.exports = {
  createDriver,
  getAllDrivers,
  findDriverByEmail,
  deleteDriverByEmail,
  updateDriverByEmail,
}
