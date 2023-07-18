const express = require('express');
const app = express();
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const { Pool } = require('pg');

// Create a new Pool instance
const pool = new Pool();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));

app.use((req, res, next) => {
  req.pool = pool;
  next();
});

// Routes
const driverRoutes = require('./routes/drivers');
app.use('/api/drivers', driverRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// Catch all route
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server Started on port ${port}. Happy Coding.`);
});
