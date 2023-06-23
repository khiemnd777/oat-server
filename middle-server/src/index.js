const express = require('express');
// const cors = require('cors');
const bodyParser = require('body-parser');
const { wrap } = require('./utils/auth-utils');

const PORT = 8000;
const API_PORT = 5000;

// const corsOptions = {
//   origin: `http://localhost:${API_PORT}`,
//   optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
// };

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors(corsOptions));

app.get('/wrap', async (req, res) => {
  const path = req.query?.path;
  const result = await wrap(path, 'GET');
  res.json(result);
});

app.post('/wrap', async (req, res) => {
  const path = req.query?.path;
  const result = await wrap(path, 'POST', req.body);
  res.json(result);
});

app.put('/wrap', async (req, res) => {
  const path = req.query?.path;
  const result = await wrap(path, 'PUT', req.body);
  res.json(result);
});

app.delete('/wrap', async (req, res) => {
  const path = req.query?.path;
  const result = await wrap(path, 'DELETE');
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
