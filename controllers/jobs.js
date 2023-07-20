const { hashPassword } = require('../utilities/bcrypt');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const googleAPIKey = process.env.MAPS_API_KEY;

async function createJob(req, res) {
  try {
    const {
      jobType,
      userId,
      pickupStreet,
      pickupUnit,
      pickupPostal,
      pickupBuilding,
      deliveryStreet,
      deliveryUnit,
      deliveryPostal,
      deliveryBuilding,
      jobComments,
      totalDistance,
      price,
      items,
      itemsImg,
      status,
      time,
      date,
    } = req.body;

    // Generate a UUID for the job ID
    const jobId = uuidv4();

    // Retrieve the job type ID based on the provided jobType parameter
    const jobTypeQuery = "SELECT name FROM job_types WHERE name = $1";
    const { rows } = await pool.query(jobTypeQuery, [jobType]);
    const jobTypeId = rows[0]?.name || null;

    // Construct the INSERT query with the retrieved values
    const insertQuery = `
      INSERT INTO jobs (id, type_id, user_id, pickup_address_street, pickup_address_unit, pickup_address_postal, pickup_address_building_name, delivery_address_street, delivery_address_unit, delivery_address_postal, delivery_address_building_name, job_comments, total_distance, price, items, items_img, status, time, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `;
    const insertValues = [
      jobId,
      jobTypeId,
      userId,
      pickupStreet,
      pickupUnit,
      pickupPostal,
      pickupBuilding,
      deliveryStreet,
      deliveryUnit,
      deliveryPostal,
      deliveryBuilding,
      jobComments,
      totalDistance,
      price,
      items,
      itemsImg,
      status,
      time,
      date
    ];

    const result = await pool.query(insertQuery, insertValues);
    const insertedJob = result.rows[0];

    res.status(201).json({
      message: 'Job created successfully',
      job: insertedJob
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function assignDriver(req, res) {
    try {
      const { jobId, driverId } = req.body;
  
      const updateQuery = `
        UPDATE jobs
        SET driver_id = $1
        WHERE id = $2
        RETURNING *
      `;
      const updateValues = [driverId, jobId];
  
      const result = await pool.query(updateQuery, updateValues);
      const updatedJob = result.rows[0];
  
      res.status(200).json({
        message: 'Job updated successfully',
        job: updatedJob
      });
    } catch (error) {
      console.error('Error updating job:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async function getDistAndPrice(req, res) {
    try {
      const { deliveryPostal, pickupPostal, jobTypeName } = req.body;
  
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?` +
        `destinations=${encodeURIComponent(deliveryPostal)}` +
        `&origins=${encodeURIComponent(pickupPostal)}` +
        `&units=metric&key=${googleAPIKey}` +
        `&region=sg`;
  
      const response = await fetch(url);
      const data = await response.json();
      console.log(data); 
  
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
  
      const distanceText = data.rows[0].elements[0].distance.text;
      const distanceValue = parseFloat(distanceText.replace(/[^0-9.]/g, ''));
      const { base_price, price_per_km } = await getPrice(jobTypeName);

      const computedPrice = base_price + (distanceValue * price_per_km)
  
      res.status(200).json({ computedPrice });
    } catch (error) {
      console.error('Error calculating distance:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  async function getPrice(jobTypeName) {
    try {
      const query = 'SELECT base_price, price_per_km FROM job_types WHERE name = $1';
      const result = await pool.query(query, [jobTypeName]);
      const jobType = result.rows[0];
  
      if (!jobType) {
        return { base_price: null, price_per_km: null };
      }
  
      return jobType;
    } catch (error) {
      console.error('Error retrieving price:', error);
      throw error;
    }
  }
  
  
  
  

module.exports = { createJob, assignDriver, getDistAndPrice };
