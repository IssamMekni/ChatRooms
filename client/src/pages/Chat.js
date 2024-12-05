import React, { useState } from 'react';
import { 
    Box, 
    AppBar, 
    Toolbar, 
    Typography, 
    Button, 
    IconButton,
    Drawer,
    useTheme,
    useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChatRoomList from '../components/ChatRoomList';
import ChatRoom from '../components/ChatRoom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DRAWER_WIDTH = 300;

export default function Chat() {
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleRoomSelect = (room) => {
        setSelectedRoom(room);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <AppBar 
                position="fixed" 
                sx={{ 
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    width: '100%'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
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

            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
                sx={{
                    display: { xs: 'block' },
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        top: { xs: '56px', sm: '64px' },
                        height: { 
                            xs: 'calc(100% - 56px)',
                            sm: 'calc(100% - 64px)'
                        }
                    },
                }}
            >
                <ChatRoomList
                    onRoomSelect={handleRoomSelect}
                    selectedRoom={selectedRoom}
                />
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflow: 'hidden',
                    pt: { xs: '56px', sm: '64px' },
                }}
            >
                {selectedRoom ? (
                    <ChatRoom room={selectedRoom} />
                ) : (
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
                )}
            </Box>
        </Box>
    );
}
