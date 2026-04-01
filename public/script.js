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
        results.innerHTML = `
          <h2>${data.location.name}</h2>
          <p>Temperature: ${data.current.temp_f}°F</p>
          <p>Feels like: ${data.current.feelslike_f}°F</p>
          <p>Condition: ${data.current.condition.text} <img src=${data.current.condition.icon}></p>
          <p>Wind Speed: ${data.current.wind_mph} mph</p>
        `;

        const forecastDays = data.forecast.forecastday;
        document.querySelectorAll('.container div').forEach((card, i) => {
            const date = new Date(forecastDays[i].date + 'T00:00:00');
            const label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
            card.innerHTML = `
                <p>${label}</p>
                <img src="${forecastDays[i].day.condition.icon}">
                <p>${forecastDays[i].day.avgtemp_f}°F</p>
                <p>${forecastDays[i].day.condition.text}</p>
            `;
        });
      })
      .catch(() => {
        results.innerHTML = '<p>Something went wrong. Check your connection.</p>';
      });
  });
