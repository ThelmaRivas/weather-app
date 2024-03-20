const apiKey = "1de63ca4b984c433927d115702daeb0d";

// Retrieve elements from the DOM
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const currentWeather = document.getElementById("current-weather");
const forecast = document.getElementById("forecast");

// Retrieve search history from localStorage
const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Display search history in sidebar
const sidebar = document.createElement("div");
sidebar.id = "sidebar";
// Apply tailwind classes
sidebar.classList.add(
    "text-blue-900",
    "p-5",
    "flex",
    "w-1/6",
    "flex-col",
    "justify-center",
);
document.body.appendChild(sidebar);

updateSidebar();

function updateSidebar() {
  sidebar.innerHTML = "<h3 class='text-xl font-bold'>Search History</h3>";

  searchHistory.forEach((city, index) => {
    const cityItem = document.createElement("div");
    cityItem.textContent = city;
    // Apply tailwind classes
    cityItem.classList.add(
      "city-item",
      "text-lg",
      "cursor-pointer",
      "my-1",
      "font-semibold"
    );
    cityItem.addEventListener("click", () => {
      getWeatherData(city);
    });
    sidebar.appendChild(cityItem);
  });
};

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    getWeatherData(city);
    searchHistory.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    updateSidebar();
    cityInput.value = "";
  } else {
    alert("Please enter a city name");
  }
});

// Function to get weather data for the given city from the OpenWeatherMap API
function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

  fetch(apiUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("City not found");
      }
    })
    .then((data) => {
      displayWeatherData(data);
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("City not found. Please try again.");
    });
};

// Function to display weather data for the current and 5-day forecast
function displayWeatherData(data) {
  const city = data.city.name;

  // Display current weather
  const currentWeatherData = data.list[0];
  const currentWeatherInfo = {
    date: new Date(currentWeatherData.dt * 1000).toLocaleDateString(),
    icon: currentWeatherData.weather[0].icon,
    temperature: currentWeatherData.main.temp,
    humidity: currentWeatherData.main.humidity,
    windSpeed: currentWeatherData.wind.speed,
  };

  currentWeather.innerHTML = `
    <h2 class="text-3xl font-semibold">${city}</h2>
    <p>Date: ${currentWeatherInfo.date}</p>
    <img src="http://openweathermap.org/img/w/${currentWeatherInfo.icon}.png" alt="Weather Icon" class="w-12 h-12 mx-auto mt-4 items-center">
    <p>Temperature: ${currentWeatherInfo.temperature}°C</p>
    <p>Humidity: ${currentWeatherInfo.humidity}%</p>
    <p>Wind Speed: ${currentWeatherInfo.windSpeed} m/s</p>
  `;

  // Display 5-day forecast
  const forecastData = data.list.slice(1, 6);
  forecast.innerHTML = `<h2 class="relative bottom-10 left-10 text-2xl font-semibold">5-Day Forecast</h2>`;

  forecastData.forEach((dayData) => {
    const forecastInfo = {
      date: new Date(dayData.dt * 1000).toLocaleDateString(),
      icon: dayData.weather[0].icon,
      temperature: dayData.main.temp,
      humidity: dayData.main.humidity,
      windSpeed: dayData.wind.speed,
    };

    forecast.innerHTML += `
      <div class=" bg-blue-900 p-4 m-2 rounded-lg shadow-md">
        <p class="text-lg font-semibold text-slate-100">Date: ${forecastInfo.date}</p>
        <img src="http://openweathermap.org/img/w/${forecastInfo.icon}.png" alt="Weather Icon" class="w-12 h-12">
        <p class="text-md p-1 text-slate-100 font-semibold">Temperature: ${forecastInfo.temperature}°C</p>
        <p class="p-1 text-slate-100">Humidity: ${forecastInfo.humidity}%</p>
        <p class="p-1 text-slate-100">Wind Speed: ${forecastInfo.windSpeed} m/s</p>
      </div>
    `;
  });
};