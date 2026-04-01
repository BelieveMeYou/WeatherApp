import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/weather', async (req, res) => {
  const city = req.query.city;
  const key = process.env.WEATHER_API_KEY;

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=3`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch weather' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));