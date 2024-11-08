const express = require('express');
const router = express.Router();

// Import the controller for handling predictions
const { getPredictions } = require('../controllers/prediction');

// POST request to handle the expense prediction
router.post('/predict-expenses', getPredictions);

module.exports = router;
