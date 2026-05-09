import React from 'react';
import {
    Box,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import {
    FilterList as FilterIcon,
    WorkOutline as PlacementIcon,
    SchoolOutlined as ResultIcon,
    EventOutlined as EventIcon,
    AllInclusive as AllIcon,
} from '@mui/icons-material';
import { NOTIFICATION_TYPES } from '../../utils/constants';

const TYPE_ICON_MAP = {
    Placement: <PlacementIcon sx={{ fontSize: 18, mr: 0.5 }} />,
    Result: <ResultIcon sx={{ fontSize: 18, mr: 0.5 }} />,
    Event: <EventIcon sx={{ fontSize: 18, mr: 0.5 }} />,
};

export default function FilterBar({ activeFilter, onFilterChange }) {
    const handleChange = (_, newFilter) => {
        if (newFilter !== null) {
            onFilterChange(newFilter);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                flexWrap: 'wrap',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'rgba(255,255,255,0.5)' }}>
                <FilterIcon fontSize="small" />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Filter:
                </Typography>
            </Box>

            <ToggleButtonGroup
                value={activeFilter}
                exclusive
                onChange={handleChange}
                size="small"
                id="notification-type-filter"
                sx={{
                    '& .MuiToggleButton-root': {
                        color: 'rgba(255,255,255,0.5)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        px: { xs: 1.5, sm: 2 },
                        '&.Mui-selected': {
                            backgroundColor: 'rgba(124, 77, 255, 0.15)',
                            color: '#7c4dff',
                            borderColor: 'rgba(124, 77, 255, 0.3)',
                            '&:hover': {
                                backgroundColor: 'rgba(124, 77, 255, 0.25)',
                            },
                        },
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.05)',
                        },
                    },
                }}
            >
                <ToggleButton value="" id="filter-all">
                    <AllIcon sx={{ fontSize: 18, mr: 0.5 }} /> All
                </ToggleButton>
                {NOTIFICATION_TYPES.map((type) => (
                    <ToggleButton key={type} value={type} id={`filter-${type.toLowerCase()}`}>
                        {TYPE_ICON_MAP[type]} {type}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Box>
    );
}
