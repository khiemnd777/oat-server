const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { wrap } = require('./utils/auth-utils');
const { getApiUrl, testApiAvailable } = require('./utils/api-utils');

const PORT = 8000;

const corsOptions = {
  origin: getApiUrl(),
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

async function doWrapping(path, method, body) {
  if (testApiAvailable(path, method)) {
    return await (body ? wrap(path, method, body) : wrap(path, method));
  }
  return null;
}

app.get(/api\/+.*$/, async (req, res) => {
  const result = await doWrapping(req.path, req.method);
  res.json(result);
});

app.post(/api\/+.*$/, async (req, res) => {
  const result = await doWrapping(req.path, req.method, req.body);
  res.json(result);
});

app.put(/api\/+.*$/, async (req, res) => {
  const result = await doWrapping(req.path, req.method, req.body);
  res.json(result);
});

app.delete(/api\/+.*$/, async (req, res) => {
  const result = await doWrapping(req.path, req.method);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
