/**
 * LoadingState Component
 * Skeleton loader for notification lists
 */

import React from 'react';
import { Box, Skeleton, Card, CardContent } from '@mui/material';

export default function LoadingState({ count = 5 }) {
    return (
        <Box>
            {Array.from({ length: count }).map((_, i) => (
                <Card
                    key={i}
                    sx={{
                        mb: 1.5,
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        borderRadius: '12px',
                    }}
                >
                    <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                            <Skeleton
                                variant="rounded"
                                width={40}
                                height={40}
                                sx={{ bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '10px', flexShrink: 0 }}
                            />
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                    <Skeleton variant="rounded" width={70} height={22} sx={{ bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '11px' }} />
                                    <Skeleton variant="text" width={50} sx={{ bgcolor: 'rgba(255,255,255,0.04)' }} />
                                </Box>
                                <Skeleton variant="text" width="80%" sx={{ bgcolor: 'rgba(255,255,255,0.06)' }} />
                                <Skeleton variant="text" width="40%" sx={{ bgcolor: 'rgba(255,255,255,0.03)' }} />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}
