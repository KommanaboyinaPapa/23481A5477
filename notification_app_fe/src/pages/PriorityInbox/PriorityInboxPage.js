import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Chip,
    Paper,
    Grid,
} from '@mui/material';
import {
    PriorityHigh as PriorityIcon,
    TrendingUp as TrendingIcon,
    WorkOutline as PlacementIcon,
    SchoolOutlined as ResultIcon,
    EventOutlined as EventIcon,
} from '@mui/icons-material';
import { usePriorityInbox } from '../../hooks/usePriorityInbox';
import NotificationCard from '../../components/NotificationCard/NotificationCard';
import FilterBar from '../../components/FilterBar/FilterBar';
import LoadingState from '../../components/LoadingState/LoadingState';
import ErrorState from '../../components/ErrorState/ErrorState';
import { TOP_N_OPTIONS, TYPE_COLORS } from '../../utils/constants';
import { Log } from '../../middleware/loggingMiddleware';

export default function PriorityInboxPage() {
    const [topN, setTopN] = useState(10);
    const [filterType, setFilterType] = useState('');

    const { priorityNotifications, allNotifications, loading, error, refetch } = usePriorityInbox({
        topN,
        filterType,
    });

    useEffect(() => {
        Log('frontend', 'info', 'page', 'PriorityInboxPage mounted');
    }, []);

    const handleTopNChange = (e) => {
        setTopN(e.target.value);
        Log('frontend', 'info', 'page', `Top N changed to: ${e.target.value}`);
    };

    const handleFilterChange = (type) => {
        setFilterType(type);
        Log('frontend', 'info', 'page', `Priority filter changed to: ${type || 'all'}`);
    };

    const stats = {
        total: allNotifications.length,
        placement: allNotifications.filter((n) => n.Type === 'Placement').length,
        result: allNotifications.filter((n) => n.Type === 'Result').length,
        event: allNotifications.filter((n) => n.Type === 'Event').length,
    };

    return (
        <Container maxWidth="md" sx={{ py: { xs: 2, sm: 4 } }}>
            <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    <PriorityIcon sx={{ color: '#ff6b6b', fontSize: 32 }} />
                    <Typography
                        variant="h4"
                        id="page-title-priority"
                        sx={{
                            fontWeight: 800,
                            color: '#fff',
                            fontSize: { xs: '1.5rem', sm: '2rem' },
                            letterSpacing: '-0.5px',
                        }}
                    >
                        Priority Inbox
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 2 }}>
                    Your most important notifications, ranked by type weight and recency.
                </Typography>
            </Box>

            {!loading && !error && (
                <Grid container spacing={1.5} sx={{ mb: 3 }}>
                    {[
                        { label: 'Total', value: stats.total, color: '#7c4dff', icon: <TrendingIcon /> },
                        { label: 'Placement', value: stats.placement, color: TYPE_COLORS.Placement.chip, icon: <PlacementIcon /> },
                        { label: 'Result', value: stats.result, color: TYPE_COLORS.Result.chip, icon: <ResultIcon /> },
                        { label: 'Event', value: stats.event, color: TYPE_COLORS.Event.chip, icon: <EventIcon /> },
                    ].map((stat) => (
                        <Grid item xs={6} sm={3} key={stat.label}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1.5,
                                    textAlign: 'center',
                                    background: `${stat.color}11`,
                                    border: `1px solid ${stat.color}22`,
                                    borderRadius: '12px',
                                }}
                            >
                                <Box sx={{ color: stat.color, mb: 0.5 }}>{stat.icon}</Box>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: stat.color }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                                    {stat.label}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 2,
                    mb: 2,
                }}
            >
                <FilterBar activeFilter={filterType} onFilterChange={handleFilterChange} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                        Show top:
                    </Typography>
                    <FormControl size="small">
                        <Select
                            value={topN}
                            onChange={handleTopNChange}
                            id="top-n-selector"
                            sx={{
                                color: '#7c4dff',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(124, 77, 255, 0.3)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'rgba(124, 77, 255, 0.5)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#7c4dff',
                                },
                                '& .MuiSelect-icon': { color: '#7c4dff' },
                                minWidth: 75,
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        bgcolor: '#1e1e3f',
                                        border: '1px solid rgba(124, 77, 255, 0.2)',
                                        '& .MuiMenuItem-root': {
                                            color: 'rgba(255,255,255,0.8)',
                                            '&.Mui-selected': { bgcolor: 'rgba(124, 77, 255, 0.15)' },
                                            '&:hover': { bgcolor: 'rgba(124, 77, 255, 0.1)' },
                                        },
                                    },
                                },
                            }}
                        >
                            {TOP_N_OPTIONS.map((n) => (
                                <MenuItem key={n} value={n}>
                                    {n}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            {!loading && !error && priorityNotifications.length > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip
                        icon={<TrendingIcon sx={{ fontSize: 16 }} />}
                        label={`Top ${priorityNotifications.length} Priority`}
                        size="small"
                        sx={{
                            background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.15), rgba(238, 90, 36, 0.15))',
                            color: '#ff6b6b',
                            border: '1px solid rgba(255, 107, 107, 0.2)',
                            fontWeight: 600,
                            '& .MuiChip-icon': { color: '#ff6b6b' },
                        }}
                    />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                        Ranked by: Placement &gt; Result &gt; Event + Recency
                    </Typography>
                </Box>
            )}

            {loading ? (
                <LoadingState count={Math.min(topN, 8)} />
            ) : error ? (
                <ErrorState message={error} onRetry={refetch} />
            ) : priorityNotifications.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                        No priority notifications
                    </Typography>
                </Box>
            ) : (
                <Box>
                    {priorityNotifications.map((notif) => (
                        <NotificationCard key={notif.ID} notification={notif} showRank />
                    ))}
                </Box>
            )}
        </Container>
    );
}
