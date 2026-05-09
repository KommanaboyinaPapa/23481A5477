/**
 * Notification Service
 * Fetches notifications from the evaluation-service API
 * using a bearer token from the shared auth service.
 */

const axios = require('axios');
const path = require('path');

// Import shared auth service from logging_middleware
const { getToken, clearToken } = require(path.resolve(__dirname, '..', 'logging_middleware', 'authService'));

const NOTIFICATIONS_URL = 'http://4.224.186.213/evaluation-service/notifications';

/**
 * Fetches all notifications from the API.
 * Handles token refresh on 401/403 errors.
 *
 * @param {object} [queryParams] - Optional query parameters { limit, page, notification_type }
 * @returns {Promise<Array>} Array of notification objects
 */
async function fetchNotifications(queryParams = {}) {
    const makeRequest = async (token) => {
        const response = await axios.get(NOTIFICATIONS_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            params: queryParams,
            timeout: 15000,
        });
        return response.data;
    };

    try {
        const token = await getToken();
        const data = await makeRequest(token);
        return data.notifications || data || [];
    } catch (error) {
        // Retry once on auth failure
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            clearToken();
            try {
                const freshToken = await getToken();
                const data = await makeRequest(freshToken);
                return data.notifications || data || [];
            } catch (retryError) {
                console.error('[NotificationService] Retry failed:', retryError.message);
                throw retryError;
            }
        }
        console.error('[NotificationService] Fetch failed:', error.message);
        throw error;
    }
}

module.exports = { fetchNotifications };
