/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware')

const USE_PROXY = 'http://localhost:8080/';

module.exports = function(app) {

    if (USE_PROXY) {
        app.use([
            '/api',
        ], createProxyMiddleware({
            target: USE_PROXY,
            changeOrigin: true,
            cookiePathRewrite: '/'
        }));
    }

}
/* eslint-enable */
