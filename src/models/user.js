const mongoose = require("mongoose");


const userschema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    createdrooms:[{
        type:mongoose.Schema.ObjectId,
        ref:"ChatRoom",
    }],
    joinedrooms:[{
        type:mongoose.Schema.ObjectId,
        ref:"ChatRoom",
    }],
    messages:[{
        type:mongoose.Schema.ObjectId,
        ref:"Message",
    }]
});

const User = mongoose.model("User",userschema);

module.exports= User;