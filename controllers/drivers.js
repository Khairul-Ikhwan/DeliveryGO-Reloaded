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


module.exports = {
  createDriver,
  getAllDrivers,
  findDriverByEmail,
  deleteDriverByEmail,
}
