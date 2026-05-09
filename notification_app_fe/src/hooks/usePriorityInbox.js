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

            // Fetch multiple pages to gather enough data for priority ranking (API max limit is 10)
            let allData = [];
            for (let pg = 1; pg <= 5; pg++) {
                const pageData = await fetchNotifications({ limit: 10, page: pg });
                allData = allData.concat(pageData);
                if (pageData.length < 10) break; // No more pages
            }
            setAllNotifications(allData);

            // Apply type filter if specified
            let filtered = allData;
            if (filterType) {
                filtered = allData.filter((n) => n.Type === filterType);
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
