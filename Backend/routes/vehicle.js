const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle');
const authMiddleware = require('../middlewares/auth');

router.post('/create', authMiddleware, vehicleController.createVehicle);

module.exports = router;
