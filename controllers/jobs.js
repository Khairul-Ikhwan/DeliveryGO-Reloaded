const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const {verifyToken} = require('../utilities/jwt');
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
    const { jobId } = req.body;
    const rawToken = req.headers.authorization;
    const token = rawToken.replace("Bearer ", "");
    const decodedToken = verifyToken(token);

    if (!decodedToken || !decodedToken.driverId) {
      res.status(401).json({ error: 'Invalid or expired token.' });
      return;
    }

    const updateQuery = `
      UPDATE jobs
      SET driver_id = $1, status = 'Assigned'
      WHERE id = $2
      RETURNING *
    `;
    const updateValues = [decodedToken.driverId, jobId];

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
  
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
  
      const distanceText = data.rows[0].elements[0].distance.text;
      const distanceValue = parseFloat(distanceText.replace(/[^0-9.]/g, ''));
      const { base_price, price_per_km } = await getPrice(jobTypeName);
      const computedPrice = Number((base_price + distanceValue * price_per_km).toFixed(1));
      res.status(200).json({ computedPrice, distanceValue });
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
  
  async function getJobs(req, res) {
    try {
      const status = "Created"; // Specify the status for which you want to retrieve jobs
  
      const query = `
        SELECT *
        FROM jobs
        WHERE status = $1
      `;
      const result = await pool.query(query, [status]);
      const jobs = result.rows;
  
      res.status(200).json({ jobs });
    } catch (error) {
      console.error('Error retrieving jobs:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async function driverJobs(req, res) {
    try {
      // Get the driverId from the decoded token
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = verifyToken(token);
  
      if (!decodedToken || !decodedToken.driverId) {
        res.status(401).json({ error: 'Invalid or expired token.' });
        return;
      }
  
      const driverId = decodedToken.driverId;
  
      const status = 'Assigned';
  
      const query = `
        SELECT *
        FROM jobs
        WHERE status = $1 AND driver_id = $2
      `;
  
      const result = await pool.query(query, [status, driverId]);
      const jobs = result.rows;
  
      res.status(200).json({ jobs });
    } catch (error) {
      console.error('Error retrieving jobs:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async function userJobs(req, res) {
    try {
      // Get the userId from the decoded token
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = verifyToken(token);
  
      if (!decodedToken || !decodedToken.userId) {
        res.status(401).json({ error: 'Invalid or expired token.' });
        return;
      }
  
      const userId = decodedToken.userId;
  
      // const status = 'Assigned';
  
      const query = `
        SELECT *
        FROM jobs
        WHERE user_id = $1
      `;
  
      const result = await pool.query(query, [userId]);
      const jobs = result.rows;
  
      res.status(200).json({ jobs });
    } catch (error) {
      console.error('Error retrieving jobs:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  

  async function driverCompleteJobs(req, res) {
    try {
      // Get the driverId from the decoded token
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = verifyToken(token);
  
      if (!decodedToken || !decodedToken.driverId) {
        res.status(401).json({ error: 'Invalid or expired token.' });
        return;
      }
  
      const driverId = decodedToken.driverId;
  
      const status = 'Complete';
  
      const query = `
        SELECT *
        FROM jobs
        WHERE status = $1 AND driver_id = $2
      `;
  
      const result = await pool.query(query, [status, driverId]);
      const jobs = result.rows;
  
      res.status(200).json({ jobs });
    } catch (error) {
      console.error('Error retrieving jobs:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  async function complete(req, res) {
    try {
      const { jobId } = req.body;
      const rawToken = req.headers.authorization;
      const token = rawToken.replace("Bearer ", "");
      const decodedToken = verifyToken(token);
  
      if (!decodedToken || !decodedToken.driverId) {
        res.status(401).json({ error: 'Invalid or expired token.' });
        return;
      }
  
      const updateQuery = `
        UPDATE jobs
        SET driver_id = $1, status = 'Complete'
        WHERE id = $2
        RETURNING *
      `;
      const updateValues = [decodedToken.driverId, jobId];
  
      const result = await pool.query(updateQuery, updateValues);
      const updatedJob = result.rows[0];
  
      res.status(200).json({
        message: 'Job completed successfully',
        job: updatedJob
      });
    } catch (error) {
      console.error('Error completing job:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  

  
  
  

module.exports = { createJob, assignDriver, getDistAndPrice, getJobs, driverJobs, complete, driverCompleteJobs, userJobs };
