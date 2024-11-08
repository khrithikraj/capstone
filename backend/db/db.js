const mongoose = require('mongoose');

const db = async () => {
    try {
        mongoose.set('strictQuery', false);

        // Directly add the MongoDB URL here
        await mongoose.connect('mongodb://localhost:27017/P1', 
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('DB Connected');
    } catch (error) {
        console.log('DB Connection Error:', error);
    }
};

module.exports = { db };