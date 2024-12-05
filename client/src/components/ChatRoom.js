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
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6">{room.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {room.members.length} members
                </Typography>
            </Paper>

            <Paper
                sx={{
                    flex: 1,
                    mb: 2,
                    overflow: 'auto',
                    maxHeight: 'calc(100vh - 250px)',
                }}
            >
                <List>
                    {messages.map((message) => (
                        <ListItem
                            key={message._id}
                            sx={{
                                flexDirection: 'column',
                                alignItems:
                                    message.senderID._id === user.id
                                        ? 'flex-end'
                                        : 'flex-start',
                                mb: 1,
                            }}
                        >
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    mb: 0.5,
                                    alignSelf: message.senderID._id === user.id ? 'flex-end' : 'flex-start'
                                }}
                            >
                                {message.senderID.username}
                            </Typography>
                            <ListItemText
                                primary={message.content}
                                sx={{
                                    m: 0,
                                    '.MuiListItemText-primary': {
                                        backgroundColor:
                                            message.senderID._id === user.id
                                                ? 'primary.light'
                                                : 'grey.100',
                                        padding: '8px 12px',
                                        borderRadius: '12px',
                                        display: 'inline-block',
                                        color: message.senderID._id === user.id ? 'white' : 'inherit',
                                    }
                                }}
                            />
                        </ListItem>
                    ))}
                    <div ref={messagesEndRef} />
                </List>
            </Paper>

            <Paper
                component="form"
                onSubmit={handleSendMessage}
                sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
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
                />
                <IconButton type="submit" color="primary">
                    <SendIcon />
                </IconButton>
            </Paper>
        </Box>
    );
}
