const mongoose = require('mongoose');

require('dotenv').config();

// mongodb uri atlas
const uri = process.env.database_url;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
};

exports.connectDB = async () => {
    try {
        await mongoose.connect(uri, options);
        console.log("Connected successfully to MongoDB Atlas");
    } catch (error) {
        console.error("Error connecting to MongoDB Atlas:", error);
        throw error; // Propagate the error for proper handling
    }
};
