import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../context/AuthContext';

export default function ChatRoom({ room }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const { user } = useAuth();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchMessages = useCallback(async () => {
        if (!room) return;
        
        try {
            const response = await axios.get(`/api/home/message/${room._id}/messages`);
            setMessages(response.data.data || []);
            scrollToBottom();
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }, [room]);

    useEffect(() => {
        if (room) {
            fetchMessages();
            // Set up polling for new messages
            const interval = setInterval(fetchMessages, 3000);
            return () => clearInterval(interval);
        }
    }, [room, fetchMessages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            await axios.post(`/api/home/message/${room._id}/sendmessage`, {
                content: newMessage,
            });
            setNewMessage('');
            await fetchMessages(); // Immediately fetch new messages after sending
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (!room) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                }}
            >
                <Typography variant="h6" color="text.secondary">
                    Select a chat room to start messaging
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden'
        }}>
            <Paper 
                elevation={1} 
                sx={{ 
                    p: 2,
                    borderBottom: 1,
                    borderColor: 'divider'
                }}
            >
                <Typography variant="h6">{room.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {room.members?.length || 0} members
                </Typography>
            </Paper>

            <Box sx={{ 
                flex: 1,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                p: 2
            }}>
                <List>
                    {messages.map((message) => (
                        <ListItem
                            key={message._id}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: message.senderID._id === user.id ? 'flex-end' : 'flex-start',
                                p: 0.5
                            }}
                        >
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                                {message.senderID.username}
                            </Typography>
                            <Paper
                                elevation={1}
                                sx={{
                                    p: '8px 12px',
                                    maxWidth: '70%',
                                    bgcolor: message.senderID._id === user.id ? 'primary.main' : 'grey.100',
                                    color: message.senderID._id === user.id ? 'common.white' : 'text.primary',
                                    borderRadius: '12px'
                                }}
                            >
                                <Typography variant="body1">
                                    {message.content}
                                </Typography>
                            </Paper>
                        </ListItem>
                    ))}
                    <div ref={messagesEndRef} />
                </List>
            </Box>

            <Paper
                component="form"
                onSubmit={handleSendMessage}
                sx={{
                    p: 2,
                    display: 'flex',
                    gap: 1,
                    borderTop: 1,
                    borderColor: 'divider'
                }}
            >
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                        }
                    }}
                    multiline
                    maxRows={3}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '20px'
                        }
                    }}
                />
                <IconButton 
                    type="submit" 
                    color="primary"
                    disabled={!newMessage.trim()}
                >
                    <SendIcon />
                </IconButton>
            </Paper>
        </Box>
    );
}
