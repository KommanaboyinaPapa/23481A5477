/**
 * Logging Middleware Configuration
 * Contains API endpoints and authentication credentials
 */

const CONFIG = {
  AUTH_URL: 'http://4.224.186.213/evaluation-service/auth',
  LOG_URL: 'http://4.224.186.213/evaluation-service/logs',

  AUTH_CREDENTIALS: {
    email: 'papakommanaboyina@gmail.com',
    name: 'KOMMANABOYINA PAPA',
    rollNo: '23481A5477',
    accessCode: 'eJdCuC',
    clientID: '65847399-a7e6-4c3a-a3dc-5ed632166272',
    clientSecret: 'nzZbKhscDTnAffPU',
  },

  // Token refresh buffer — refresh 2 minutes before actual expiry
  TOKEN_REFRESH_BUFFER_MS: 2 * 60 * 1000,

  // Token lifetime (30 minutes)
  TOKEN_LIFETIME_MS: 30 * 60 * 1000,

  // Valid stack values
  VALID_STACKS: ['frontend'],

  // Valid log levels
  VALID_LEVELS: ['debug', 'info', 'warn', 'error', 'fatal'],

  // Valid packages for frontend
  VALID_FRONTEND_PACKAGES: ['api', 'component', 'hook', 'page', 'state', 'style'],
};

module.exports = CONFIG;
