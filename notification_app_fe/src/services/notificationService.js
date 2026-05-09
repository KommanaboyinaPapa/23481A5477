/**
 * Notification Service
 * API client for the notifications endpoint with pagination & filtering
 */

import axios from 'axios';
import API_CONFIG from './config';
import { getToken, clearToken } from './authService';
import { Log } from '../middleware/loggingMiddleware';

/**
 * Fetches notifications from the API.
 *
 * @param {object} params - { limit, page, notification_type }
 * @returns {Promise<object>} { notifications: [...] }
 */
export async function fetchNotifications(params = {}) {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.NOTIFICATIONS}`;

    const makeRequest = async (token) => {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            params,
            timeout: API_CONFIG.REQUEST_TIMEOUT,
        });
        return response.data;
    };

    try {
        const token = await getToken();
        await Log('frontend', 'info', 'api', `Fetching notifications: ${JSON.stringify(params)}`);

        const data = await makeRequest(token);
        const notifications = data.notifications || data || [];

        await Log('frontend', 'info', 'api', `Fetched ${notifications.length} notifications successfully`);

        return notifications;
    } catch (error) {
        // Retry on auth failure
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            clearToken();
            await Log('frontend', 'warn', 'api', 'Token expired, refreshing and retrying notification fetch');

            try {
                const freshToken = await getToken();
                const data = await makeRequest(freshToken);
                return data.notifications || data || [];
            } catch (retryError) {
                await Log('frontend', 'error', 'api', `Notification fetch retry failed: ${retryError.message}`);
                throw retryError;
            }
        }

        await Log('frontend', 'error', 'api', `Notification fetch failed: ${error.message}`);
        throw error;
    }
}
