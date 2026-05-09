/**
 * Logging Middleware (Frontend)
 * Reusable Log function that sends structured logs to the evaluation-service
 */

import axios from 'axios';
import API_CONFIG from '../services/config';
import { getToken, clearToken } from '../services/authService';

const VALID_STACKS = ['frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const VALID_PACKAGES = ['api', 'component', 'hook', 'page', 'state', 'style'];

/**
 * Sends a structured log entry to the evaluation-service.
 *
 * @param {string} stack   - "frontend"
 * @param {string} level   - "debug" | "info" | "warn" | "error" | "fatal"
 * @param {string} pkg     - "api" | "component" | "hook" | "page" | "state" | "style"
 * @param {string} message - Descriptive log message
 * @returns {Promise<object|null>} { logID, message } or null on failure
 */
export async function Log(stack, level, pkg, message) {
    const s = (stack || '').toLowerCase();
    const l = (level || '').toLowerCase();
    const p = (pkg || '').toLowerCase();

    // Validate fields
    if (!VALID_STACKS.includes(s)) {
        console.warn(`[Log] Invalid stack: "${stack}"`);
        return null;
    }
    if (!VALID_LEVELS.includes(l)) {
        console.warn(`[Log] Invalid level: "${level}"`);
        return null;
    }
    if (!VALID_PACKAGES.includes(p)) {
        console.warn(`[Log] Invalid package: "${pkg}"`);
        return null;
    }
    if (!message || !message.trim()) {
        console.warn('[Log] Empty message');
        return null;
    }

    const payload = { stack: s, level: l, package: p, message };
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGS}`;

    try {
        const token = await getToken();
        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
        });

        // Also log to console for dev visibility
        const icon = { debug: '🔍', info: 'ℹ️', warn: '⚠️', error: '❌', fatal: '💀' };
        console.log(`${icon[l] || '📝'} [${l.toUpperCase()}][${p}] ${message}`);

        return response.data;
    } catch (error) {
        // Retry once on auth failure
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            clearToken();
            try {
                const freshToken = await getToken();
                const response = await axios.post(url, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${freshToken}`,
                    },
                    timeout: 10000,
                });
                return response.data;
            } catch (retryErr) {
                console.error('[Log] Retry failed:', retryErr.message);
                return null;
            }
        }

        console.error('[Log] Failed:', error.message);
        return null;
    }
}
