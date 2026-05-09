/**
 * API Configuration
 * Central configuration for all API endpoints and authentication
 */

const API_CONFIG = {
    BASE_URL: 'http://4.224.186.213/evaluation-service',

    ENDPOINTS: {
        AUTH: '/auth',
        LOGS: '/logs',
        NOTIFICATIONS: '/notifications',
    },

    AUTH_CREDENTIALS: {
        email: 'papakommanaboyina@gmail.com',
        name: 'KOMMANABOYINA PAPA',
        rollNo: '23481A5477',
        accessCode: 'eJdCuC',
        clientID: '65847399-a7e6-4c3a-a3dc-5ed632166272',
        clientSecret: 'nzZbKhscDTnAffPU',
    },

    TOKEN_LIFETIME_MS: 30 * 60 * 1000,
    TOKEN_REFRESH_BUFFER_MS: 2 * 60 * 1000,
    REQUEST_TIMEOUT: 15000,
};

export default API_CONFIG;
