import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    List,
    ListItem,
    ListItemText,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Box,
    Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../context/AuthContext';

export default function ChatRoomList({ onRoomSelect, selectedRoom }) {
    const [rooms, setRooms] = useState([]);
    const [joinedRooms, setJoinedRooms] = useState(new Set());
    const [openNewRoom, setOpenNewRoom] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();

    const fetchRooms = async () => {
        try {
            const response = await axios.get('/api/home/chatroom/search');
            setRooms(response.data.data || []);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    const fetchJoinedRooms = async () => {
        try {
            const response = await axios.get('/api/home/chatroom/joinedroom');
            const joinedRoomIds = new Set(response.data.data.map(room => room._id));
            setJoinedRooms(joinedRoomIds);
        } catch (error) {
            console.error('Error fetching joined rooms:', error);
        }
    };

    useEffect(() => {
        fetchRooms();
        fetchJoinedRooms();
    }, []);

    const handleCreateRoom = async () => {
        try {
            await axios.post('/api/home/chatroom/create', { name: newRoomName });
            setOpenNewRoom(false);
            setNewRoomName('');
            fetchRooms();
            fetchJoinedRooms();
        } catch (error) {
            console.error('Error creating room:', error);
        }
    };

    const handleDeleteRoom = async (roomId) => {
        try {
            await axios.delete(`/api/home/chatroom/${roomId}`);
            fetchRooms();
            fetchJoinedRooms();
            if (selectedRoom?._id === roomId) {
                onRoomSelect(null);
            }
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    };

    const handleJoinRoom = async (roomId) => {
        try {
            await axios.post(`/api/home/chatroom/${roomId}/join`);
            await fetchJoinedRooms();
            await fetchRooms();
        } catch (error) {
            console.error('Error joining room:', error);
        }
    };

    const handleQuitRoom = async (roomId) => {
        try {
            await axios.post(`/api/home/chatroom/${roomId}/quit`);
            await fetchJoinedRooms();
            await fetchRooms();
            if (selectedRoom?._id === roomId) {
                onRoomSelect(null);
            }
        } catch (error) {
            console.error('Error quitting room:', error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api/home/chatroom/search?name=${searchQuery}`);
            setRooms(response.data.data || []);
        } catch (error) {
            console.error('Error searching rooms:', error);
        }
    };

    return (
        <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: 'background.paper'
        }}>
            <Box sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column',
                gap: 1
            }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        size="small"
                        placeholder="Search rooms..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        sx={{ flex: 1 }}
                        InputProps={{
                            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                    />
                    <IconButton 
                        color="primary"
                        onClick={() => setOpenNewRoom(true)}
                    >
                        <AddIcon />
                    </IconButton>
                </Box>
            </Box>

            <Divider />

            <List sx={{ 
                flex: 1, 
                overflow: 'auto',
                '& .MuiListItem-root': {
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }
            }}>
                {rooms
                    .filter(room => room.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((room) => (
                        <ListItem
                            key={room._id}
                            selected={selectedRoom?._id === room._id}
                            onClick={() => onRoomSelect(room)}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'stretch',
                                gap: 1,
                                py: 1,
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                },
                                '&.Mui-selected': {
                                    bgcolor: 'primary.light',
                                    '&:hover': {
                                        bgcolor: 'primary.light',
                                    },
                                },
                            }}
                        >
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                width: '100%'
                            }}>
                                <ListItemText
                                    primary={room.name}
                                    secondary={
                                        room.creator.username === user.username
                                            ? 'Creator: You'
                                            : `Creator: ${room.creator.username}`
                                    }
                                />
                                {room.creator.username === user.username && (
                                    <IconButton
                                        edge="end"
                                        color="error"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteRoom(room._id);
                                        }}
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Box>
                            {room.creator.username !== user.username && (
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        joinedRooms.has(room._id) 
                                            ? handleQuitRoom(room._id)
                                            : handleJoinRoom(room._id);
                                    }}
                                    color={joinedRooms.has(room._id) ? "error" : "primary"}
                                    fullWidth
                                >
                                    {joinedRooms.has(room._id) ? 'Quit' : 'Join'}
                                </Button>
                            )}
                        </ListItem>
                    ))}
            </List>

            <Dialog open={openNewRoom} onClose={() => setOpenNewRoom(false)}>
                <DialogTitle>Create New Chat Room</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Room Name"
                        type="text"
                        fullWidth
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenNewRoom(false)}>Cancel</Button>
                    <Button onClick={handleCreateRoom}>Create</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
