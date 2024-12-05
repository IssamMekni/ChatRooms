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
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                <TextField
                    size="small"
                    placeholder="Search rooms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{ flex: 1, mr: 1 }}
                />
                <IconButton onClick={handleSearch}>
                    <SearchIcon />
                </IconButton>
                <IconButton onClick={() => setOpenNewRoom(true)}>
                    <AddIcon />
                </IconButton>
            </Box>

            <List>
                {rooms.map((room) => (
                    <ListItem
                        key={room._id}
                        selected={selectedRoom?._id === room._id}
                        onClick={() => onRoomSelect(room)}
                        secondaryAction={
                            <>
                                {room.creator !== user.id && (
                                    joinedRooms.has(room._id) ? (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleQuitRoom(room._id);
                                            }}
                                            sx={{ mr: 1 }}
                                        >
                                            Quit
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleJoinRoom(room._id);
                                            }}
                                            sx={{ mr: 1 }}
                                        >
                                            Join
                                        </Button>
                                    )
                                )}
                                {room.creator === user.id && (
                                    <IconButton
                                        edge="end"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteRoom(room._id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </>
                        }
                    >
                        <ListItemText
                            primary={room.name}
                            secondary={`Created by: ${room.creator === user.id ? 'You' : room.creatorName}`}
                        />
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
