const apiKey = 'e48278641922fd7a4efc450deaf44097'; // Reemplaza con tu API key de OpenWeatherMap
const defaultCity = 'Cordoba,ar';

window.onload = function () {
  searchWeather(defaultCity);
};

function searchWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayCurrentWeather(data);
    })
    .catch(error => {
      console.error('Error fetching current weather data:', error);
    });

  const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(forecastApiUrl)
    .then(response => response.json())
    .then(data => {
      displayDailyForecast(data);
      displayHourlyForecast(data.list[0].dt_txt); // Muestra el pronóstico por horas para el primer día por defecto
    })
    .catch(error => {
      console.error('Error fetching daily forecast data:', error);
    });
}

function displayCurrentWeather(data) {
  const currentWeatherContainer = document.getElementById('currentWeather');
  currentWeatherContainer.innerHTML = '';

  const temperature = data.main.temp.toFixed(1);
  const iconCode = data.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

  const temperatureElement = document.createElement('p');
  temperatureElement.classList.add('temperature');
  temperatureElement.innerHTML = `${temperature} °C`;

  const iconElement = document.createElement('img');
  iconElement.classList.add('temperature-icon');
  iconElement.src = iconUrl;
  iconElement.alt = 'Icono del tiempo';

  currentWeatherContainer.appendChild(temperatureElement);
  currentWeatherContainer.appendChild(iconElement);
}

function displayDailyForecast(data) {
  const dailyForecastContainer = document.getElementById('dailyForecast');
  dailyForecastContainer.innerHTML = '';

  const dayList = document.createElement('ul');
  dayList.classList.add('day-list');

  for (let i = 0; i < data.list.length; i += 8) {
    const forecast = data.list[i];
    const date = new Date(forecast.dt * 1000);
    const day = date.toLocaleDateString('es-AR', { weekday: 'long' });

    const iconCode = forecast.weather[0].icon;
    const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

    const temperature = forecast.main.temp.toFixed(1);

    const dayForecast = document.createElement('li');
    dayForecast.classList.add('day-forecast');
    dayForecast.innerHTML = `
      <p class="day">${day}</p>
      <img class="icon" src="${iconUrl}" alt="Icono del tiempo">
      <p class="temperature">${temperature} °C</p>
    `;

    dayForecast.addEventListener('click', () => {
      displayHourlyForecast(forecast.dt_txt);
    });

    dayList.appendChild(dayForecast);
  }

  dailyForecastContainer.appendChild(dayList);
}

function displayHourlyForecast(dayStartTime) {
  const hourlyForecastContainer = document.getElementById('hourlyForecast');
  hourlyForecastContainer.innerHTML = '';

  const dayStartTimestamp = new Date(dayStartTime).getTime() / 1000;

  const dayForecast = document.createElement('li');
  dayForecast.classList.add('hourly-forecast-title');
  dayForecast.textContent = 'Pronóstico por horas';

  hourlyForecastContainer.appendChild(dayForecast);

  for (let i = 0; i < 24; i++) {
    const hourlyTimestamp = dayStartTimestamp + i * 3600; // Avanza en intervalos de 1 hora
    const hourlyForecast = data.list.find(item => item.dt === hourlyTimestamp);

    if (hourlyForecast) {
      const time = new Date(hourlyForecast.dt * 1000).toLocaleTimeString('es-AR', { hour: 'numeric', minute: 'numeric' });
      const iconCode = hourlyForecast.weather[0].icon;
      const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
      const temperature = hourlyForecast.main.temp.toFixed(1);

      const hourlyForecastItem = document.createElement('li');
      hourlyForecastItem.classList.add('hourly-forecast-item');
      hourlyForecastItem.innerHTML = `
        <p class="time">${time}</p>
        <img class="icon" src="${iconUrl}" alt="Icono del tiempo">
        <p class="temperature">${temperature} °C</p>
      `;

      hourlyForecastContainer.appendChild(hourlyForecastItem);
    }
  }
}
