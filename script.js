const apiKey = 'dc4c37f61a4d0973c247f29387986b4b';

document.getElementById('fetchWeatherBtn').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value.trim();
  if (city) {
    getWeatherByCity(city);
  } else {
    alert('Please enter a city name');
  }
});

document.getElementById('currentCityBtn').addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude.toFixed(2);
      const lon = position.coords.longitude.toFixed(2);
      getWeatherByCoords(lat, lon);
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
});

document.getElementById('themeToggleCheckbox').addEventListener('change', (event) => {
  document.body.classList.toggle('dark-theme', event.target.checked);
});

async function getWeatherByCity(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&cnt=7&units=metric&appid=${apiKey}`;
  fetchWeatherData(apiUrl);
}

async function getWeatherByCoords(lat, lon) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=7&units=metric&appid=${apiKey}`;
  fetchWeatherData(apiUrl);
}

async function fetchWeatherData(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // alert('Failed to fetch weather data. Please enter a valid city name.');
  }
}

function displayWeather(data) {
  const cityName = data.city.name;
  document.getElementById('cityName').innerText = `Weather Forecast for ${cityName}`;

  const forecastDetails = document.getElementById('forecastDetails');
  forecastDetails.innerHTML = '';

  const forecastData = data.list.slice(0, 7);

  forecastData.forEach(day => {
    const date = new Date(day.dt * 1000);
    const dateString = date.toDateString();
    const timeString = date.toLocaleTimeString();

    const dayDiv = document.createElement('div');
    dayDiv.classList.add('forecast-day');
    dayDiv.innerHTML = `
      <p><strong>Date:</strong> ${dateString}</p>
      <p><strong>Time:</strong> ${timeString}</p>
      <p><strong>Weather:</strong> ${day.weather[0].description}</p>
      <p><strong>Temperature:</strong> ${day.main.temp}°C</p>
      <p><strong>Humidity:</strong> ${day.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${day.wind.speed} m/s</p>
    `;
    forecastDetails.appendChild(dayDiv);
  });

  document.querySelector('.output-container').style.display = 'block';
  displayChart(forecastData);
}

function displayChart(data) {
  const labels = data.map(day => new Date(day.dt * 1000).toLocaleDateString());
  const temperatures = data.map(day => day.main.temp);
  const humidities = data.map(day => day.main.humidity);
  const windSpeeds = data.map(day => day.wind.speed);

  const ctx = document.getElementById('weatherChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temperatures,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false,
          yAxisID: 'y-axis-temp'
        },
        {
          label: 'Humidity (%)',
          data: humidities,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: false,
          yAxisID: 'y-axis-humidity'
        },
        {
          label: 'Wind Speed (m/s)',
          data: windSpeeds,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false,
          yAxisID: 'y-axis-wind'
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            id: 'y-axis-temp',
            type: 'linear',
            position: 'left',
            ticks: {
              beginAtZero: true
            },
            scaleLabel: {
              display: true,
              labelString: 'Temperature (°C)'
            }
          },
          {
            id: 'y-axis-humidity',
            type: 'linear',
            position: 'right',
            ticks: {
              beginAtZero: true
            },
            scaleLabel: {
              display: true,
              labelString: 'Humidity (%)'
            }
          },
          {
            id: 'y-axis-wind',
            type: 'linear',
            position: 'right',
            ticks: {
              beginAtZero: true
            },
            scaleLabel: {
              display: true,
              labelString: 'Wind Speed (m/s)'
            }
          }
        ]
      }
    }
  });
}
