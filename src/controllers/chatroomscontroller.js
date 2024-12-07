const ChatRoom = require("../models/chatroom");
const User = require("../models/user");

// Get list of joined chatrooms for the authenticated user
exports.getListJoinedRoom = async (req, res) => {
    try {
        
        const userId = req.session.userId;
        const chatrooms = await ChatRoom.find({ members: userId }).populate("members", "username"); // Adjust the field to populate
        res.status(200).json({ success: true, data: chatrooms });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Search for chatrooms by name
exports.searchForRoom = async (req, res) => {
    try {
        const { name } = req.query;
        const chatrooms = await ChatRoom.find({ name: new RegExp(name, "i") })
            .populate("creator", "username"); // Populate creator's username
        res.status(200).json({ success: true, data: chatrooms });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create a new chatroom
exports.createRoom = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { name } = req.body;
        console.log("userId:", userId);

        // Check if a room with the same name already exists
        const existingRoom = await ChatRoom.findOne({ name });
        if (existingRoom) {
            return res.status(400).json({ success: false, message: "Chatroom name already exists" });
        }

        // Create and save the new chatroom
        const chatroom = new ChatRoom({
            name,
            creator: userId,
            members: [userId] // Add the creator to the members list
        });
        await chatroom.save();

        res.status(201).json({ success: true, data: chatroom });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete a chatroom
exports.deleteRoom = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { chatroomID } = req.params;

        // Find the chatroom to be deleted
        const chatroom = await ChatRoom.findById(chatroomID);
        if (!chatroom) {
            return res.status(404).json({ success: false, message: "Chatroom not found" });
        }

        // Only the creator can delete the chatroom
        if (chatroom.creator.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Only the creator can delete this chatroom" });
        }

        await ChatRoom.findByIdAndDelete(chatroomID);
        res.status(200).json({ success: true, message: "Chatroom deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Join a chatroom
exports.joinRoom = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { chatroomID } = req.params;

        // Find the chatroom to join
        const chatroom = await ChatRoom.findById(chatroomID);
        if (!chatroom) {
            return res.status(404).json({ success: false, message: "Chatroom not found" });
        }

        // Add the user to the members list if not already a member
        if (!chatroom.members.includes(userId)) {
            chatroom.members.push(userId);
            await chatroom.save();
        }

        res.status(200).json({ success: true, message: "Joined chatroom successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Quit a chatroom
exports.quitRoom = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { chatroomID } = req.params;

        // Find the chatroom to quit
        const chatroom = await ChatRoom.findById(chatroomID);
        if (!chatroom) {
            return res.status(404).json({ success: false, message: "Chatroom not found" });
        }

        // The creator cannot quit the chatroom
        if (chatroom.creator.toString() === userId.toString()) {
            return res.status(403).json({ success: false, message: "The creator cannot quit the chatroom" });
        }

        // Remove the user from the members list
        chatroom.members = chatroom.members.filter(member => member.toString() !== userId.toString());
        await chatroom.save();

        res.status(200).json({ success: true, message: "Quit chatroom successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
