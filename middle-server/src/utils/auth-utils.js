const axios = require('axios');
const { sleep, isNullOrEmpty } = require('./common-utils');
const { getApiUrl } = require('./api-utils');

const API_AUTH_USERNAME = 'admin@oat.com';
const API_AUTH_PASSWORD = '123456';
const API_AUTH_REMEMBER_ME = false;

const API_AUTH_ATTEMPT_COUNT = 5;

let cachedAuthToken;

function getHeaders(authToken) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'Application/json',
    Authorization: `Bearer ${authToken}`,
  };
}

async function getAuthToken(attempt) {
  if (!isNullOrEmpty(cachedAuthToken)) {
    return cachedAuthToken;
  }

  if (isNullOrEmpty(attempt)) {
    attempt = API_AUTH_ATTEMPT_COUNT;
    if (attempt <= 0) {
      attempt = 1;
    }
  }

  if (attempt === 0) {
    return '';
  }

  try {
    const result = await axios.post(`${getApiUrl()}/token`, {
      username: API_AUTH_USERNAME,
      password: API_AUTH_PASSWORD,
      remember_me: API_AUTH_REMEMBER_ME,
    });

    if (result?.status === 200) {
      return (cachedAuthToken = result?.data.access_token);
    }
    return await this.getAuthToken(attempt--);
  } catch (ex) {
    // re-run getAuthToken in 5 times
    await sleep(1000);
    console.log(
      `Attempt to get auth-token in ${attempt} time${attempt > 1 ? 's' : ''}`
    );
    return await getAuthToken(--attempt);
  }
}

async function internalWrap(path, method, data, authToken) {
  const methodLowerCase = String(method ?? 'GET').toLowerCase();
  const apiPath = `${getApiUrl()}${path}`;
  switch (methodLowerCase) {
    case 'get': {
      return await axios.get(apiPath, {
        headers: getHeaders(authToken),
      });
    }
    case 'post': {
      return await axios.post(apiPath, data, {
        headers: getHeaders(authToken),
      });
    }
    case 'put': {
      return await axios.put(apiPath, data, {
        headers: getHeaders(authToken),
      });
    }
    case 'delete': {
      return await axios.delete(apiPath, {
        headers: getHeaders(authToken),
      });
    }
  }
}

async function wrap(path, method, data, attempt) {
  if (isNullOrEmpty(attempt)) {
    attempt = API_AUTH_ATTEMPT_COUNT;
    if (attempt <= 0) {
      attempt = 1;
    }
  }

  if (attempt === 0) {
    return null;
  }

  const authToken = await getAuthToken();
  if (authToken) {
    try {
      const result = await internalWrap(path, method, data, authToken);

      if (result.status === 200) {
        return result.data;
      }

      if (result.status >= 401 && result.status <= 403) {
        cachedAuthToken = '';
        // return await wrap(path, method, data, attempt--);
        return null;
      }
    } catch (ex) {
      if (ex?.response?.data?.errors) {
        return ex.response.data;
      }
      return null;
    }
  }

  return null;
}

module.exports = {
  wrap,
};
