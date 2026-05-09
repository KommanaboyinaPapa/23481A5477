import axios from 'axios';
import API_CONFIG from './config';

let cachedToken = null;
let tokenExpiresAt = 0;

export async function getToken() {
    const now = Date.now();

    if (cachedToken && now < tokenExpiresAt - API_CONFIG.TOKEN_REFRESH_BUFFER_MS) {
        return cachedToken;
    }

    try {
        const response = await axios.post(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH}`,
            API_CONFIG.AUTH_CREDENTIALS,
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: API_CONFIG.REQUEST_TIMEOUT,
            }
        );

        const data = response.data;
        const token = data.access_token || data.token || data.accessToken || data.bearer;

        if (!token) {
            throw new Error('No token in response');
        }

        cachedToken = token;
        tokenExpiresAt = now + API_CONFIG.TOKEN_LIFETIME_MS;

        return cachedToken;
    } catch (error) {
        const msg = error.response
            ? `Auth failed [${error.response.status}]`
            : `Auth error: ${error.message}`;
        throw new Error(msg);
    }
}

export function clearToken() {
    cachedToken = null;
    tokenExpiresAt = 0;
}
