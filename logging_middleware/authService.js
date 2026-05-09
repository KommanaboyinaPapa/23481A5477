/**
 * Auth Service
 * Manages bearer token lifecycle — fetch, cache, and auto-refresh
 * before the 30-minute expiry window.
 */

const axios = require('axios');
const CONFIG = require('./config');

let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Returns a valid bearer token.
 * If the cached token is still valid (with a 2-min buffer), returns it.
 * Otherwise, fetches a fresh token from the auth endpoint.
 *
 * @returns {Promise<string>} Bearer token string
 */
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

        // The API may return the token in different fields — handle common patterns
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

/**
 * Clears the cached token, forcing a refresh on the next call.
 */
function clearToken() {
    cachedToken = null;
    tokenExpiresAt = 0;
}

module.exports = { getToken, clearToken };
