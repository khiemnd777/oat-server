const theApi = require('./../../api.json');
const RoutePattern = require('route-pattern');

module.exports = {
  getApiUrl() {
    const API_URL = process.env.API_URL ?? 'http://localhost';
    const API_PORT = process.env.API_PORT ?? 5000;
    return `${API_URL}:${API_PORT}`;
  },
  testApiAvailable(path, method = 'GET') {
    return theApi.api.some(
      (x) =>
        RoutePattern.fromString(x.path).matches(path) && x.method === method
    );
  },
};
