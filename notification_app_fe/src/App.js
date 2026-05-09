import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/Navbar/Navbar';
import AllNotificationsPage from './pages/AllNotifications/AllNotificationsPage';
import PriorityInboxPage from './pages/PriorityInbox/PriorityInboxPage';
import { Log } from './middleware/loggingMiddleware';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#7c4dff' },
        secondary: { main: '#448aff' },
        background: {
            default: '#0d0d1a',
            paper: '#16162a',
        },
        text: {
            primary: 'rgba(255,255,255,0.9)',
            secondary: 'rgba(255,255,255,0.5)',
        },
    },
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h4: { fontWeight: 800, letterSpacing: '-0.5px' },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: 'linear-gradient(180deg, #0d0d1a 0%, #13132b 50%, #0d0d1a 100%)',
                    minHeight: '100vh',
                    '&::-webkit-scrollbar': { width: 6 },
                    '&::-webkit-scrollbar-track': { background: 'transparent' },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(124, 77, 255, 0.3)',
                        borderRadius: 3,
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: { textTransform: 'none', fontWeight: 600 },
            },
        },
    },
});

function App() {
    React.useEffect(() => {
        Log('frontend', 'info', 'component', 'App component mounted — application started');
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <NotificationProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<AllNotificationsPage />} />
                        <Route path="/priority" element={<PriorityInboxPage />} />
                    </Routes>
                </BrowserRouter>
            </NotificationProvider>
        </ThemeProvider>
    );
}

export default App;
