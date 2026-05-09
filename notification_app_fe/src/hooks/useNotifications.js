import { useState, useEffect, useCallback } from 'react';
import { fetchNotifications } from '../services/notificationService';
import { Log } from '../middleware/loggingMiddleware';

export function useNotifications({ page = 1, limit = 10, notificationType = '' } = {}) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const loadNotifications = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            await Log('frontend', 'info', 'hook', `useNotifications: fetching page=${page} limit=${limit} type=${notificationType || 'all'}`);

            const params = { page, limit };
            if (notificationType) {
                params.notification_type = notificationType;
            }

            const data = await fetchNotifications(params);
            setNotifications(data);
            setHasMore(data.length === limit);

            await Log('frontend', 'info', 'hook', `useNotifications: loaded ${data.length} notifications`);
        } catch (err) {
            setError(err.message || 'Failed to fetch notifications');
            await Log('frontend', 'error', 'hook', `useNotifications error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [page, limit, notificationType]);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    return { notifications, loading, error, hasMore, refetch: loadNotifications };
}
