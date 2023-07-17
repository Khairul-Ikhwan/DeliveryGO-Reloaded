const client = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Create User
async function createUser(req, res) {
  try {
    const { driverName, driverEmail, driverPhone, driverPfp, driverPassword } = req.body;

    // Generate a UUID for the driver ID
    const driverId = uuidv4();

    // DB Insert op
    const query = 'INSERT INTO public.drivers ("id", "driverName", "driverEmail", "driverPhone", "driverPfp", "driverPassword") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
    const values = [driverId, driverName, driverEmail, driverPhone, driverPfp, driverPassword];
    const result = await client.query(query, values);

    const insertedDriver = result.rows[0];

    res.status(201).json({
      message: 'Driver created successfully',
      driver: insertedDriver
    });
  } catch (error) {
    // Handle any errors that occur during the INSERT operation
    console.error('Error creating driver:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { createUser };
