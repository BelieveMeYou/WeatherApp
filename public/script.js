let unit = 'F';

function setBackground(condition) {
    const c = condition.toLowerCase();
    if (c.includes('sun') || c.includes('clear')) {
        document.body.style.background = 'linear-gradient(to bottom, #f7b733, #fc4a1a)';
        
      } else if (c.includes('partly cloudy')) {
        document.body.style.background = 'linear-gradient(to bottom, #f7b733, #757F9A)';
      } else if (c.includes('rain') || c.includes('drizzle') || c.includes('mist')) {
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
    
    results.style.display = 'block';
    results.innerHTML = '<p>Loading...</p>';

    fetch(`/weather?city=${city}`)
      .then(res => res.json())
      .then(data => {
        if(data.error){
            results.innerHTML = `<p>City not found. Try again.</p>`;
            return;
        }
        setBackground(data.current.condition.text);
        localStorage.setItem('lastCity', city);
        results.style.display = 'block';
        const temp = unit === 'F' ? data.current.temp_f : data.current.temp_c;
        const feelsLike = unit === 'F' ? data.current.feelslike_f : data.current.feelslike_c;
        const symbol = unit === 'F' ? '°F' : '°C';
        results.innerHTML = `
          <div class="card-inner">
            <h2>${data.location.name} <img src=${data.current.condition.icon}></h2>
            <p>Condition: ${data.current.condition.text}</p>
            <p>Temperature: ${temp}${symbol}</p>
            <p>Feels like: ${feelsLike}${symbol}</p>
            <p>Wind Speed: ${data.current.wind_mph} mph</p>
          </div>
        `;

        const forecastDays = data.forecast.forecastday;
        document.querySelector('.container').style.display = 'flex';
        document.querySelectorAll('.container div').forEach((card, i) => {
            const date = new Date(forecastDays[i].date + 'T00:00:00');
            const label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            const temp = unit === 'F' ? forecastDays[i].day.avgtemp_f : forecastDays[i].day.avgtemp_c;
            const symbol = unit === 'F' ? '°F' : '°C';
            card.innerHTML = `
            <div class="card-inner">
                <p>${label}</p>
                <img src="${forecastDays[i].day.condition.icon}">
                <p>${forecastDays[i].day.condition.text}</p>
                <p>${temp}${symbol}</p>
            </div>
            `;
        });
      })
      .catch((err) => {
        console.log(err);
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
    const temp = unit === 'F' ? data.current.temp_f : data.current.temp_c;
    const symbol = unit === 'F' ? '°F' : '°C';
    card.innerHTML = `
    <div class="card-inner">
      <p><strong>${data.location.name}</strong></p>
      <img src="${data.current.condition.icon}">
      <p>${temp}${symbol}</p>
      <p>${data.current.condition.text}</p>
    </div>
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
  const lastCity = localStorage.getItem('lastCity');
  if (lastCity) {
    document.querySelector('#city-input').value = lastCity;
    document.querySelector('#search-btn').click();
  }

  document.querySelector('#unit-toggle').addEventListener('click', () =>{
    unit = unit === 'F' ? 'C' : 'F';
    document.querySelector('#unit-toggle').textContent = unit === 'F' ? 'Switch to °C' : 'Switch to °F';
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
      document.querySelector('#city-input').value = lastCity;
      document.querySelector('#search-btn').click();
    }
    cycleCity;
  });