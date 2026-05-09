/**
 * usePriorityInbox Hook
 * Fetches all notifications and computes the top-N priority inbox
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchNotifications } from '../services/notificationService';
import { getTopNNotifications } from '../utils/priorityAlgorithm';
import { Log } from '../middleware/loggingMiddleware';

export function usePriorityInbox({ topN = 10, filterType = '' } = {}) {
    const [priorityNotifications, setPriorityNotifications] = useState([]);
    const [allNotifications, setAllNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadPriorityInbox = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            await Log('frontend', 'info', 'hook', `usePriorityInbox: computing top ${topN}, filter=${filterType || 'all'}`);

            // Fetch a larger set to have enough data for priority calculation
            const data = await fetchNotifications({ limit: 100, page: 1 });
            setAllNotifications(data);

            // Apply type filter if specified
            let filtered = data;
            if (filterType) {
                filtered = data.filter((n) => n.Type === filterType);
            }

            // Compute top-N
            const topNotifs = getTopNNotifications(filtered, topN);
            setPriorityNotifications(topNotifs);

            await Log('frontend', 'info', 'hook', `usePriorityInbox: computed ${topNotifs.length} priority notifications`);
        } catch (err) {
            setError(err.message || 'Failed to compute priority inbox');
            await Log('frontend', 'error', 'hook', `usePriorityInbox error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [topN, filterType]);

    useEffect(() => {
        loadPriorityInbox();
    }, [loadPriorityInbox]);

    return { priorityNotifications, allNotifications, loading, error, refetch: loadPriorityInbox };
}
