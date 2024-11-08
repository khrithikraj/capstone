const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
const app = express();

// Import the prediction route
const predictRoute = require('./routes/predict');  // Import the prediction route here

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)));

// Use the prediction route
app.use('/api/v1', predictRoute);  // Add this line to use the prediction route

// Start server on localhost:5000
const server = () => {
    db();
    app.listen(5000, () => {
        console.log('Server is listening on http://localhost:5000');
    });
};

server();
