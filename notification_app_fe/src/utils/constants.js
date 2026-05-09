/**
 * Application Constants
 */

export const NOTIFICATION_TYPES = ['Event', 'Result', 'Placement'];

export const TOP_N_OPTIONS = [10, 15, 20, 25, 50];

export const TYPE_COLORS = {
    Placement: { bg: '#1a237e', text: '#fff', chip: '#3f51b5' },
    Result: { bg: '#004d40', text: '#fff', chip: '#009688' },
    Event: { bg: '#e65100', text: '#fff', chip: '#ff9800' },
};

export const TYPE_ICONS = {
    Placement: 'WorkOutline',
    Result: 'SchoolOutlined',
    Event: 'EventOutlined',
};

export const VIEWED_STORAGE_KEY = 'campus_notifications_viewed';
