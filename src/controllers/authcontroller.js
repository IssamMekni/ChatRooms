const mongoose = require("mongoose");
const path = require("path");
const user = require("../models/user");
const bcrypt = require("bcrypt");

// Register new user
async function register(req, res) {
    try {
        const { username, password } = req.body;
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if the user already exists
        const existUser = await user.findOne({ username });
        if (existUser) {
            return res.status(400).json({ message: "This user already exists" });
        } else {
            // Create the new user
            const newUser = await user.create({
                username: username,
                password: hashedPassword,
            });

            return res.status(201).json({ message: "User created successfully" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error on creating new user', error: error.message });
    }
}

// Login the user
async function login(req, res) {
    try {
        const { username, password } = req.body;

        // Find the user in the database
        const existUser = await user.findOne({ username });

        if (existUser) {
            // Compare the password with the hashed password
            const isMatch = await bcrypt.compare(password, existUser.password);
            if (isMatch) {
                req.session.userId = existUser._id;
                //return res.sendFile(path.join(__dirname, '../../public/home.html'))

                return res.status(200).json({ 
                           message: "Login successful" , 
                           userID: existUser._id,
                });
            } else {
                return res.status(401).json({ message: "Wrong password" });
            }
        } else {
            return res.status(404).json({ message: "This user does not exist" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error in login user", error: error.message });
    }
}

module.exports = { register, login };
