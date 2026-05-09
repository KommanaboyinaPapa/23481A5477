/**
 * ErrorState Component
 * Displays error messages with retry option
 */

import React from 'react';
import { Typography, Button, Paper } from '@mui/material';
import { ErrorOutline as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

export default function ErrorState({ message, onRetry }) {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 4,
                textAlign: 'center',
                background: 'rgba(244, 67, 54, 0.05)',
                border: '1px solid rgba(244, 67, 54, 0.15)',
                borderRadius: '16px',
            }}
        >
            <ErrorIcon sx={{ fontSize: 48, color: '#f44336', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#f44336', mb: 1, fontWeight: 600 }}>
                Something went wrong
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 3 }}>
                {message || 'Failed to load notifications. Please try again.'}
            </Typography>
            {onRetry && (
                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={onRetry}
                    id="retry-button"
                    sx={{
                        borderColor: '#f44336',
                        color: '#f44336',
                        '&:hover': {
                            borderColor: '#d32f2f',
                            backgroundColor: 'rgba(244, 67, 54, 0.08)',
                        },
                    }}
                >
                    Retry
                </Button>
            )}
        </Paper>
    );
}
