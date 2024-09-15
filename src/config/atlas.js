const mongoose = require('mongoose');

require('dotenv').config();

// mongodb uri atlas
const uri = process.env.database_url;


exports.connectDB = ()=> {
    mongoose.connect(uri,)
    .then(()=>{console.log("connected successfully to mongodb atlas")})
    .catch((error)=>{console.log("error connecting to mongodb atlas : ",error)});
};
