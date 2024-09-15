const mongoose = require("mongoose");


const messageSchema = mongoose.Schema({
    senderID:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    chatroomID:{
        type:mongoose.Schema.ObjectId,
        ref:"ChatRoom",
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    mediaURL:{
        type:String
    },
    timestamp:{
        type:Date,
        default:Date.now,
    },

});

const Message = mongoose.model("Message",messageSchema);

module.exports= Message;
