const axios = require('axios');
const CONFIG = require('./config');

let cachedToken = null;
let tokenExpiresAt = 0;

async function getToken() {
    const now = Date.now();

    if (cachedToken && now < tokenExpiresAt - CONFIG.TOKEN_REFRESH_BUFFER_MS) {
        return cachedToken;
    }

    try {
        const response = await axios.post(CONFIG.AUTH_URL, CONFIG.AUTH_CREDENTIALS, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000,
        });

        const data = response.data;
        const token =
            data.access_token ||
            data.token ||
            data.accessToken ||
            data.bearer ||
            (typeof data === 'string' ? data : null);

        if (!token) {
            throw new Error(
                `Auth response did not contain a recognizable token field. Response: ${JSON.stringify(data)}`
            );
        }

        cachedToken = token;
        tokenExpiresAt = now + CONFIG.TOKEN_LIFETIME_MS;

        return cachedToken;
    } catch (error) {
        const message = error.response
            ? `Auth failed with status ${error.response.status}: ${JSON.stringify(error.response.data)}`
            : `Auth request failed: ${error.message}`;

        throw new Error(message);
    }
}

function clearToken() {
    cachedToken = null;
    tokenExpiresAt = 0;
}

module.exports = { getToken, clearToken };
