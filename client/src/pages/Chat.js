import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import ChatRoomList from '../components/ChatRoomList';
import ChatRoom from '../components/ChatRoom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Private Chat Room
                    </Typography>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                        {user.username}
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ flex: 1, display: 'flex', mt: 3 }}>
                <Box
                    sx={{
                        width: 300,
                        mr: 2,
                        borderRight: 1,
                        borderColor: 'divider',
                    }}
                >
                    <ChatRoomList
                        onRoomSelect={setSelectedRoom}
                        selectedRoom={selectedRoom}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <ChatRoom room={selectedRoom} />
                </Box>
            </Container>
        </Box>
    );
}
