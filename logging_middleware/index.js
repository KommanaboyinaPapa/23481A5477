const axios = require('axios');
const CONFIG = require('./config');
const { getToken, clearToken } = require('./authService');

function validateField(value, allowed, fieldName) {
    if (!allowed.includes(value)) {
        throw new Error(
            `Invalid ${fieldName}: "${value}". Allowed values: [${allowed.join(', ')}]`
        );
    }
}

async function Log(stack, level, pkg, message) {
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

    const payload = {
        stack: s,
        level: l,
        package: p,
        message: message,
    };

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

if (require.main === module) {
    (async () => {
        try {
            console.log('Testing Log middleware...');
            const result = await Log('frontend', 'info', 'api', 'Logging middleware self-test executed successfully');
            console.log('Log sent successfully:', result);
        } catch (err) {
            console.error('Log test failed:', err.message);
        }
    })();
}

module.exports = { Log };
