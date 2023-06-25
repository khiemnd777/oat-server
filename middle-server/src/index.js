const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { wrap } = require('./utils/auth-utils');
const { getApiUrl, testApiAvailable } = require('./utils/api-utils');

const PORT = 8000;

console.log(testApiAvailable('api/categories', 'POST'));

const corsOptions = {
  origin: getApiUrl(),
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.get(/api\/+.*$/, async (req, res) => {
  if (testApiAvailable(req.path, req.method)) {
    const result = await wrap(req.path, req.method);
    res.json(result);
    return;
  }
  res.json(null);
});

app.post(/api\/+.*$/, async (req, res) => {
  if (testApiAvailable(req.path, req.method)) {
    const result = await wrap(req.path, req.method, req.body);
    res.json(result);
    return;
  }
  res.json(null);
});

app.put(/api\/+.*$/, async (req, res) => {
  if (testApiAvailable(req.path, req.method)) {
    const result = await wrap(req.path, req.method, req.body);
    res.json(result);
    return;
  }
  res.json(null);
});

app.delete(/api\/+.*$/, async (req, res) => {
  if (testApiAvailable(req.path, req.method)) {
    const result = await wrap(req.path, req.method);
    res.json(result);
    return;
  }
  res.json(null);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
