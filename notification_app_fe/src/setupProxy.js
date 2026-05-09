const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/evaluation-service',
        createProxyMiddleware({
            target: 'http://4.224.186.213',
            changeOrigin: true,
            logLevel: 'warn',
            onError: (err, req, res) => {
                console.error('[Proxy Error]', err.message);
                res.status(502).json({ error: 'Proxy error', message: err.message });
            },
        })
    );
};
