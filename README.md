# MyWeatherApp
A weather web app that shows current conditions and a 3-day forecast for any city in the world.

## Features
- Current weather — temperature, feels like, wind speed, condition
- 3-day forecast
- Dynamic background that changes based on weather conditions
- °F / °C toggle
- Sidebar cycling through live weather from cities around the world
- Auto-loads your last searched city

## Tech Stack
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Node.js + Express
- **API:** [WeatherAPI](https://www.weatherapi.com/)

## Running Locally
1. Clone the repo
2. Run `npm install`
3. Create a `.env` file with your API key:
WEATHER_API_KEY=your_key_here
4. Run `node server.js`
5. Open `http://localhost:3000`
