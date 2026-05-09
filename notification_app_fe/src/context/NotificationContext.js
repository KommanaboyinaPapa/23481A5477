import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getViewedIds, markAsViewed as markViewedHelper, markAllAsViewed as markAllViewedHelper } from '../utils/helpers';
import { Log } from '../middleware/loggingMiddleware';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [viewedIds, setViewedIds] = useState(() => getViewedIds());
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        Log('frontend', 'info', 'state', 'NotificationProvider mounted, initial state ready');
    }, []);

    const markViewed = useCallback((id) => {
        markViewedHelper(id);
        setViewedIds((prev) => new Set([...prev, id]));
        Log('frontend', 'debug', 'state', `Notification ${id} marked as viewed`);
    }, []);

    const markAllViewed = useCallback((ids) => {
        markAllViewedHelper(ids);
        setViewedIds((prev) => new Set([...prev, ...ids]));
        Log('frontend', 'info', 'state', `Marked ${ids.length} notifications as viewed`);
    }, []);

    const isNotifViewed = useCallback((id) => viewedIds.has(id), [viewedIds]);

    const value = {
        notifications,
        setNotifications,
        viewedIds,
        markViewed,
        markAllViewed,
        isNotifViewed,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotificationContext() {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error('useNotificationContext must be used within NotificationProvider');
    }
    return ctx;
}
