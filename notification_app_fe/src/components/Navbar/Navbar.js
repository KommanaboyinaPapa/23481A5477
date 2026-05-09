/**
 * Navbar Component
 * Top navigation bar with page links and branding
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    useMediaQuery,
    useTheme,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    NotificationsActive as NotifIcon,
    PriorityHigh as PriorityIcon,
    Menu as MenuIcon,
    School as SchoolIcon,
} from '@mui/icons-material';
import { Log } from '../../middleware/loggingMiddleware';

const NAV_ITEMS = [
    { label: 'All Notifications', path: '/', icon: <NotifIcon /> },
    { label: 'Priority Inbox', path: '/priority', icon: <PriorityIcon /> },
];

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const handleNav = (path) => {
        navigate(path);
        setDrawerOpen(false);
        Log('frontend', 'info', 'component', `Navigated to ${path}`);
    };

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <Toolbar sx={{ px: { xs: 1, sm: 3 } }}>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={() => setDrawerOpen(true)}
                            sx={{ mr: 1 }}
                            id="navbar-menu-button"
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <SchoolIcon sx={{ mr: 1, fontSize: 28, color: '#7c4dff' }} />
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            letterSpacing: '-0.5px',
                            background: 'linear-gradient(135deg, #7c4dff, #448aff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            flexGrow: 1,
                            fontSize: { xs: '1rem', sm: '1.25rem' },
                        }}
                    >
                        Campus Notifications
                    </Typography>

                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {NAV_ITEMS.map((item) => (
                                <Button
                                    key={item.path}
                                    id={`nav-${item.path.replace('/', '') || 'home'}`}
                                    startIcon={item.icon}
                                    onClick={() => handleNav(item.path)}
                                    sx={{
                                        color: location.pathname === item.path ? '#7c4dff' : 'rgba(255,255,255,0.7)',
                                        fontWeight: location.pathname === item.path ? 700 : 400,
                                        borderBottom: location.pathname === item.path ? '2px solid #7c4dff' : '2px solid transparent',
                                        borderRadius: 0,
                                        px: 2,
                                        '&:hover': {
                                            color: '#fff',
                                            backgroundColor: 'rgba(124, 77, 255, 0.08)',
                                        },
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                    sx: {
                        background: '#1a1a2e',
                        color: '#fff',
                        width: 260,
                    },
                }}
            >
                <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#7c4dff' }}>
                        📚 Campus Notifs
                    </Typography>
                </Box>
                <List>
                    {NAV_ITEMS.map((item) => (
                        <ListItem key={item.path} disablePadding>
                            <ListItemButton
                                onClick={() => handleNav(item.path)}
                                selected={location.pathname === item.path}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: 'rgba(124, 77, 255, 0.15)',
                                        borderLeft: '3px solid #7c4dff',
                                    },
                                    '&:hover': { backgroundColor: 'rgba(124, 77, 255, 0.08)' },
                                }}
                            >
                                <ListItemIcon sx={{ color: location.pathname === item.path ? '#7c4dff' : 'rgba(255,255,255,0.5)', minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
}
