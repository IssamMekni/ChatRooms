const express =require('express');
const path = require('path');
session = require ("express-session");

const {connectDB} = require("./src/config/atlas")

const mainrouter = require("./src/routes/mainrouter");
const { Cookie } = require('express-session');

// downloading the envirement variables
require('dotenv').config();


const port = process.env.PORT ;
const app = express();

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
app.use('/api', mainrouter);

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port, async ()=>{
    console.log("server is running on port " + port);
    await connectDB();
});
