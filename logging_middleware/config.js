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

  TOKEN_REFRESH_BUFFER_MS: 2 * 60 * 1000,
  TOKEN_LIFETIME_MS: 30 * 60 * 1000,

  VALID_STACKS: ['frontend'],
  VALID_LEVELS: ['debug', 'info', 'warn', 'error', 'fatal'],
  VALID_FRONTEND_PACKAGES: ['api', 'component', 'hook', 'page', 'state', 'style'],
};

module.exports = CONFIG;
