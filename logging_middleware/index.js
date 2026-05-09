/**
 * Logging Middleware — Entry Point
 *
 * Exports: Log(stack, level, package, message)
 *
 * Each call validates inputs, acquires a bearer token, and POSTs
 * the log entry to the evaluation-service logs endpoint.
 */

const axios = require('axios');
const CONFIG = require('./config');
const { getToken, clearToken } = require('./authService');

/**
 * Validates that a value is within an allowed set.
 * @param {string} value
 * @param {string[]} allowed
 * @param {string} fieldName
 */
function validateField(value, allowed, fieldName) {
    if (!allowed.includes(value)) {
        throw new Error(
            `Invalid ${fieldName}: "${value}". Allowed values: [${allowed.join(', ')}]`
        );
    }
}

/**
 * Sends a structured log entry to the evaluation-service.
 *
 * @param {string} stack   - The application stack ("frontend")
 * @param {string} level   - Log severity ("debug" | "info" | "warn" | "error" | "fatal")
 * @param {string} pkg     - Package/module origin ("api" | "component" | "hook" | "page" | "state" | "style")
 * @param {string} message - Descriptive log message
 * @returns {Promise<object>} API response: { logID, message }
 */
async function Log(stack, level, pkg, message) {
    // --- Input validation ---
    if (typeof stack !== 'string' || typeof level !== 'string' || typeof pkg !== 'string' || typeof message !== 'string') {
        throw new Error('All Log arguments must be strings.');
    }

    const s = stack.toLowerCase();
    const l = level.toLowerCase();
    const p = pkg.toLowerCase();

    validateField(s, CONFIG.VALID_STACKS, 'stack');
    validateField(l, CONFIG.VALID_LEVELS, 'level');
    validateField(p, CONFIG.VALID_FRONTEND_PACKAGES, 'package');

    if (!message.trim()) {
        throw new Error('Log message must not be empty.');
    }

    // --- Build payload ---
    const payload = {
        stack: s,
        level: l,
        package: p,
        message: message,
    };

    // --- Send with retry on auth failure ---
    try {
        const token = await getToken();
        const response = await axios.post(CONFIG.LOG_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
        });

        return response.data;
    } catch (error) {
        // If 401/403, clear token and retry once
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            clearToken();
            try {
                const freshToken = await getToken();
                const retryResponse = await axios.post(CONFIG.LOG_URL, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${freshToken}`,
                    },
                    timeout: 10000,
                });
                return retryResponse.data;
            } catch (retryError) {
                const retryMsg = retryError.response
                    ? `Log retry failed [${retryError.response.status}]: ${JSON.stringify(retryError.response.data)}`
                    : `Log retry request failed: ${retryError.message}`;
                console.error('[LogMiddleware]', retryMsg);
                throw new Error(retryMsg);
            }
        }

        const msg = error.response
            ? `Log failed [${error.response.status}]: ${JSON.stringify(error.response.data)}`
            : `Log request failed: ${error.message}`;
        console.error('[LogMiddleware]', msg);
        throw new Error(msg);
    }
}

// --- Quick self-test when run directly ---
if (require.main === module) {
    (async () => {
        try {
            console.log('🔧 Testing Log middleware...');
            const result = await Log('frontend', 'info', 'api', 'Logging middleware self-test executed successfully');
            console.log('✅ Log sent successfully:', result);
        } catch (err) {
            console.error('❌ Log test failed:', err.message);
        }
    })();
}

module.exports = { Log };
