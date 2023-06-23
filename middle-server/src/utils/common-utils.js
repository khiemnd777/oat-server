module.exports = {
  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  },
  isNullOrEmpty(val) {
    return (
      'undefined' === typeof attempt ||
      attempt === null ||
      String(attempt).trim() === '' ||
      attempt.length === 0 ||
      Object.is(val, null)
    );
  },
  getApiUrl() {
    const API_URL = 'http://localhost';
    const API_PORT = 5000;
    return `${API_URL}:${API_PORT}`;
  },
};
