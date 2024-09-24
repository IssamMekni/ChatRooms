const express =require('express');
const path = require('path');
session = require ("express-session");

const {connectDB} = require("./src/config/atlas")

const mainrouter = require("./src/routes/mainrouter");
const { Cookie } = require('express-session');

// downloading the envirement variables
require('dotenv').config();


const port = process.env.port;
const app=express();
//parse json
app.use(express.json());

//strat session 
app.use(session({
    secret:"secret",
    resave: false,
    saveUninitialized:true,
    Cookie:{secure:false}

}));
// using routers
app.use(mainrouter);

// show the front
app.use(express.static(path.join(__dirname, 'public')));



app.listen(port, async ()=>{
    console.log("server is running on port " + port);
    connectDB();
   


}); 


