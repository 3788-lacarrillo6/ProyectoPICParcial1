// archivo: server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;
const apiKey = 'TU_API_KEY';

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/air', async (req, res) => {
  const { lat, lon } = req.query;
  const response = await fetch(`https://api.openaq.org/v3/latest?coordinates=${lat},${lon}`, {
    headers: { 'X-API-Key': apiKey }
  });
  const data = await response.json();
  res.json(data);
});

app.listen(PORT, () => console.log(`Proxy en http://localhost:${PORT}`));
