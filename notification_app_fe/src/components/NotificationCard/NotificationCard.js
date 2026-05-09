/**
 * NotificationCard Component
 * Displays a single notification with type badge, viewed state, and metadata
 */

import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Chip,
    Box,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    WorkOutline as PlacementIcon,
    SchoolOutlined as ResultIcon,
    EventOutlined as EventIcon,
    FiberNew as NewIcon,
    Visibility as ViewedIcon,
} from '@mui/icons-material';
import { useNotificationContext } from '../../context/NotificationContext';
import { formatRelativeTime, formatDateTime } from '../../utils/helpers';
import { TYPE_COLORS } from '../../utils/constants';

const ICONS = {
    Placement: <PlacementIcon />,
    Result: <ResultIcon />,
    Event: <EventIcon />,
};

export default function NotificationCard({ notification, showRank = false }) {
    const { markViewed, isNotifViewed } = useNotificationContext();
    const viewed = isNotifViewed(notification.ID);
    const colors = TYPE_COLORS[notification.Type] || TYPE_COLORS.Event;

    const handleMarkViewed = (e) => {
        e.stopPropagation();
        markViewed(notification.ID);
    };

    return (
        <Card
            id={`notification-card-${notification.ID}`}
            elevation={viewed ? 0 : 4}
            sx={{
                mb: 1.5,
                position: 'relative',
                background: viewed
                    ? 'rgba(255,255,255,0.02)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                border: viewed
                    ? '1px solid rgba(255,255,255,0.04)'
                    : `1px solid ${colors.chip}33`,
                borderRadius: '12px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'visible',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 32px ${colors.chip}22`,
                    borderColor: `${colors.chip}66`,
                },
            }}
        >
            {/* New badge */}
            {!viewed && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: -6,
                        right: 12,
                        animation: 'pulse 2s ease-in-out infinite',
                        '@keyframes pulse': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.6 },
                        },
                    }}
                >
                    <Chip
                        icon={<NewIcon sx={{ fontSize: 14 }} />}
                        label="NEW"
                        size="small"
                        sx={{
                            background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.65rem',
                            height: 22,
                            '& .MuiChip-icon': { color: '#fff' },
                        }}
                    />
                </Box>
            )}

            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    {/* Rank badge (for priority view) */}
                    {showRank && notification.rank && (
                        <Box
                            sx={{
                                minWidth: 36,
                                height: 36,
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${colors.chip}, ${colors.bg})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.85rem',
                                color: '#fff',
                                flexShrink: 0,
                                boxShadow: `0 4px 12px ${colors.chip}44`,
                            }}
                        >
                            #{notification.rank}
                        </Box>
                    )}

                    {/* Type icon */}
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '10px',
                            background: `${colors.chip}22`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: colors.chip,
                            flexShrink: 0,
                        }}
                    >
                        {ICONS[notification.Type] || ICONS.Event}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                            <Chip
                                label={notification.Type}
                                size="small"
                                sx={{
                                    backgroundColor: `${colors.chip}22`,
                                    color: colors.chip,
                                    fontWeight: 600,
                                    fontSize: '0.7rem',
                                    height: 22,
                                }}
                            />
                            <Typography
                                variant="caption"
                                sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}
                            >
                                {formatRelativeTime(notification.Timestamp)}
                            </Typography>
                        </Box>

                        <Typography
                            variant="body1"
                            sx={{
                                color: viewed ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.9)',
                                fontWeight: viewed ? 400 : 500,
                                fontSize: { xs: '0.875rem', sm: '0.95rem' },
                                lineHeight: 1.4,
                            }}
                        >
                            {notification.Message}
                        </Typography>

                        <Typography
                            variant="caption"
                            sx={{ color: 'rgba(255,255,255,0.3)', mt: 0.5, display: 'block', fontSize: '0.7rem' }}
                        >
                            {formatDateTime(notification.Timestamp)}
                            {showRank && notification.score && ` • Score: ${Number(notification.score).toFixed(0)}`}
                        </Typography>
                    </Box>

                    {/* Mark as viewed */}
                    {!viewed && (
                        <Tooltip title="Mark as viewed" arrow>
                            <IconButton
                                size="small"
                                onClick={handleMarkViewed}
                                id={`mark-viewed-${notification.ID}`}
                                sx={{
                                    color: 'rgba(255,255,255,0.3)',
                                    '&:hover': { color: '#7c4dff', backgroundColor: 'rgba(124, 77, 255, 0.1)' },
                                }}
                            >
                                <ViewedIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}
