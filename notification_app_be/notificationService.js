const axios = require('axios');
const path = require('path');
const { getToken, clearToken } = require(path.resolve(__dirname, '..', 'logging_middleware', 'authService'));

const NOTIFICATIONS_URL = 'http://4.224.186.213/evaluation-service/notifications';

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
