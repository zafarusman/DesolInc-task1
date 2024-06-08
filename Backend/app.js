const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const vehicleRoutes = require('./routes/vehicle');
const verifyTokenRoute = require('./routes/verifyToken');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/verifyToken', verifyTokenRoute); 

module.exports = app;
