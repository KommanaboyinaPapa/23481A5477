import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Pagination,
    Chip,
    Button,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import {
    NotificationsActive as NotifIcon,
    DoneAll as DoneAllIcon,
} from '@mui/icons-material';
import { useNotifications } from '../../hooks/useNotifications';
import { useNotificationContext } from '../../context/NotificationContext';
import NotificationCard from '../../components/NotificationCard/NotificationCard';
import FilterBar from '../../components/FilterBar/FilterBar';
import LoadingState from '../../components/LoadingState/LoadingState';
import ErrorState from '../../components/ErrorState/ErrorState';
import { Log } from '../../middleware/loggingMiddleware';

const ITEMS_PER_PAGE = 10;

export default function AllNotificationsPage() {
    const [page, setPage] = useState(1);
    const [filterType, setFilterType] = useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { notifications, loading, error, hasMore, refetch } = useNotifications({
        page,
        limit: ITEMS_PER_PAGE,
        notificationType: filterType,
    });

    const { markAllViewed } = useNotificationContext();

    useEffect(() => {
        Log('frontend', 'info', 'page', 'AllNotificationsPage mounted');
    }, []);

    const handlePageChange = (_, value) => {
        setPage(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        Log('frontend', 'info', 'page', `Navigated to page ${value}`);
    };

    const handleFilterChange = (type) => {
        setFilterType(type);
        setPage(1);
        Log('frontend', 'info', 'page', `Filter changed to: ${type || 'all'}`);
    };

    const handleMarkAllViewed = () => {
        const ids = notifications.map((n) => n.ID);
        markAllViewed(ids);
        Log('frontend', 'info', 'page', `Marked ${ids.length} notifications as viewed`);
    };

    const estimatedPages = hasMore ? page + 1 : page;

    return (
        <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, flexWrap: 'wrap' }}>
                    <NotifIcon sx={{ color: '#7c4dff', fontSize: 32 }} />
                    <Typography
                        variant="h4"
                        id="page-title-all"
                        sx={{
                            fontWeight: 800,
                            color: '#fff',
                            fontSize: { xs: '1.5rem', sm: '2rem' },
                            letterSpacing: '-0.5px',
                        }}
                    >
                        All Notifications
                    </Typography>
                    {notifications.length > 0 && (
                        <Chip
                            label={`${notifications.length} shown`}
                            size="small"
                            sx={{
                                bgcolor: 'rgba(124, 77, 255, 0.15)',
                                color: '#7c4dff',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                            }}
                        />
                    )}
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 2 }}>
                    Stay updated with the latest campus placements, results, and events.
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                <FilterBar activeFilter={filterType} onFilterChange={handleFilterChange} />
                {notifications.length > 0 && (
                    <Button
                        size="small"
                        startIcon={<DoneAllIcon />}
                        onClick={handleMarkAllViewed}
                        id="mark-all-viewed-btn"
                        sx={{
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '0.75rem',
                            '&:hover': { color: '#7c4dff', backgroundColor: 'rgba(124, 77, 255, 0.08)' },
                        }}
                    >
                        Mark all viewed
                    </Button>
                )}
            </Box>

            {loading ? (
                <LoadingState count={6} />
            ) : error ? (
                <ErrorState message={error} onRetry={refetch} />
            ) : notifications.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                        No notifications found
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.2)', mt: 1 }}>
                        {filterType ? `No ${filterType} notifications available.` : 'Check back later for updates.'}
                    </Typography>
                </Box>
            ) : (
                <>
                    <Box>
                        {notifications.map((notif) => (
                            <NotificationCard key={notif.ID} notification={notif} />
                        ))}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination
                            count={estimatedPages}
                            page={page}
                            onChange={handlePageChange}
                            size={isMobile ? 'small' : 'medium'}
                            id="pagination-controls"
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    color: 'rgba(255,255,255,0.5)',
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    '&.Mui-selected': {
                                        backgroundColor: 'rgba(124, 77, 255, 0.2)',
                                        color: '#7c4dff',
                                        borderColor: 'rgba(124, 77, 255, 0.3)',
                                    },
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                    },
                                },
                            }}
                        />
                    </Box>
                </>
            )}
        </Container>
    );
}
