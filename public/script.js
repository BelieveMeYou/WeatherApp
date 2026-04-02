function setBackground(condition) {
    const c = condition.toLowerCase();
    if (c.includes('sun') || c.includes('clear')) {
        document.body.style.background = 'linear-gradient(to bottom, #f7b733, #fc4a1a)';
      } else if (c.includes('partly cloudy')) {
        document.body.style.background = 'linear-gradient(to bottom, #f7b733, #757F9A)';
      }else if (c.includes('rain') || c.includes('drizzle')) {
        document.body.style.background = 'linear-gradient(to bottom, #4b6cb7, #182848)';
      } else if (c.includes('snow')) {
        document.body.style.background = 'linear-gradient(to bottom, #e0eafc, #cfdef3)';
      } else if (c.includes('cloud') || c.includes('overcast')) {
        document.body.style.background = 'linear-gradient(to bottom, #757F9A, #D7DDE8)';
      } else {
        document.body.style.background = '#BAC095';
      }
}

document.querySelector('#search-btn').addEventListener('click', () => {
    const city = document.querySelector('#city-input').value;
    const results = document.querySelector('#results');
    
    if(!city){
        results.innerHTML = '<p>Please enter a city name.</p>';
        return;
    }
    fetch(`/weather?city=${city}`)
      .then(res => res.json())
      .then(data => {
        if(data.error){
            results.innerHTML = `<p>City not found. Try again.</p>`;
            return;
        }
        setBackground(data.current.condition.text);
        results.style.display = 'block';
        results.innerHTML = `
          <h2>${data.location.name}</h2>
          <p><img src=${data.current.condition.icon}></p>
          <p>Condition: ${data.current.condition.text}</p>
          <p>Temperature: ${data.current.temp_f}°F</p>
          <p>Feels like: ${data.current.feelslike_f}°F</p>
          <p>Wind Speed: ${data.current.wind_mph} mph</p>
        `;

        const forecastDays = data.forecast.forecastday;
        document.querySelector('.container').style.display = 'flex';
        document.querySelectorAll('.container div').forEach((card, i) => {
            const date = new Date(forecastDays[i].date + 'T00:00:00');
            const label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            card.innerHTML = `
                <p>${label}</p>
                <img src="${forecastDays[i].day.condition.icon}">
                <p>${forecastDays[i].day.condition.text}</p>
                <p>${forecastDays[i].day.avgtemp_f}°F</p>
            `;
        });
      })
      .catch(() => {
        results.innerHTML = '<p>Something went wrong. Check your connection.</p>';
    });
});

document.querySelector('#city-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        document.querySelector('#search-btn').click();
    }
});

const cityPool = ['Tokyo', 'London', 'Paris', 'Sydney', 'Dubai', 'Toronto', 'Mumbai', 'Berlin', 'Cairo', 'Bangkok', 'San Francisco', 'New York', 'Seoul', 'Saigon', 'Warsaw', 'Berlin', 'Rio de Janeiro', 'Singapore', 'Taipei', 'Sydney', 'Los Angeles'];
const cityWeatherData = [];
let cityIndex = 3;
async function loadSidebarCities() {
    for (const city of cityPool) {
        const res = await fetch(`/weather?city=${city}`);
        const data = await res.json();
        if (!data.error) cityWeatherData.push(data);
    }
    const sidebar = document.querySelector('#sidebar'); 
    cityWeatherData.slice(0, 3).forEach(data => {
        sidebar.appendChild(createSidebarCard(data));
    });
    setInterval(cycleCity, 6000);
}
function createSidebarCard(data) {
    const card = document.createElement('div');
    card.classList.add('sidebar-card');
    card.innerHTML = `
      <p><strong>${data.location.name}</strong></p>
      <img src="${data.current.condition.icon}">
      <p>${data.current.temp_f}°F</p>
      <p>${data.current.condition.text}</p>
    `;
    return card; 
}

function cycleCity() {
    const sidebar = document.querySelector('#sidebar');
    const cards = sidebar.querySelectorAll('.sidebar-card');

    cards.forEach(card => card.classList.add('sidebar-removing'));

    setTimeout(() => {
      sidebar.innerHTML = '';
      for (let j = 0; j < 3; j++) {
        sidebar.appendChild(createSidebarCard(cityWeatherData[cityIndex % cityWeatherData.length]));
        cityIndex++;
      }
    }, 500);
  }

  loadSidebarCities();