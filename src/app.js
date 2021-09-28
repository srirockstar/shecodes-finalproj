//***Date

let now = new Date();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
let hour = now.getHours();
let minute = now.getMinutes();
if (minute < 10) {
  minute = `0${minute}`;
}

let currentDate = document.querySelector("h2.date");
currentDate.innerHTML = `${day}, ${hour}:${minute}`;

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

//***Form
function citySearched(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#searchCity");
  let h1 = document.querySelector("h1");
  h1.innerHTML = `${searchInput.value}`;

  searchCity(searchInput.value);
}

function searchCity(city) {
  let apiKey = "5b7438cdfc6f92bfe624b6f60dd02829";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showTemperature);
}

let cityForm = document.querySelector("form");
cityForm.addEventListener("submit", citySearched);

//*** Weather API

function getForecast(coordinates) {
  let apiKey = "5b7438cdfc6f92bfe624b6f60dd02829";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let temperatureElement = document.querySelector("#current-temperature");
  let searchedDesc = response.data.weather[0].description;
  let searchedDescription = document.querySelector("#temp-description");
  let searchedW = response.data.wind.speed;
  let searchedWind = document.querySelector("#wind");
  let searchedHum = response.data.main.humidity;
  let searchedHumidity = document.querySelector("#humidity");
  let iconElement = document.querySelector("#icon");

  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = `${temperature}`;
  searchedDescription.innerHTML = searchedDesc;
  searchedWind.innerHTML = `Wind speed: ${searchedW} km/h`;
  searchedHumidity.innerHTML = `Humidity: ${searchedHum}%`;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

let apiKey = "5b7438cdfc6f92bfe624b6f60dd02829";
let units = "metric";
let city = document.querySelector("#searchCity");

let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
cityForm.addEventListener("submit", axios.get(apiUrl).then(showTemperature));

//*** Current location

function showWeather(response) {
  let cityName = response.data.name;
  let currentCityName = document.querySelector("h1");
  let cityTemp = Math.round(response.data.main.temp);
  let currentCityTemp = document.querySelector("#current-temperature");
  let description = response.data.weather[0].description;
  let currentDescription = document.querySelector("#temp-description");
  let wind = response.data.wind.speed;
  let currentWind = document.querySelector("#wind");
  let humidity = response.data.main.humidity;
  let currentHumidity = document.querySelector("#humidity");

  currentCityName.innerHTML = cityName;
  currentCityTemp.innerHTML = `${cityTemp}`;
  currentDescription.innerHTML = description;
  currentWind.innerHTML = `Wind speed: ${wind} km/h`;
  currentHumidity.innerHTML = `Humidity: ${humidity}%`;

  getForecast(response.data.coord);
}

function retrievePosition(position) {
  let apiKey = "5b7438cdfc6f92bfe624b6f60dd02829";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(url).then(showWeather);
}

let buttonLocation = document.querySelector("#current-location");
buttonLocation.addEventListener(
  "click",
  navigator.geolocation.getCurrentPosition(retrievePosition)
);

//*** Weather conversion

function displayFarenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temperature");
  celsiusLink.classList.remove("active");
  farenheitLink.classList.add("active");
  let farenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(farenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#current-temperature");
  celsiusLink.classList.add("active");
  farenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let farenheitLink = document.querySelector("#farenheit-link");
farenheitLink.addEventListener("click", displayFarenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let celsiusTemperature = null;

//*** code Weather forecast

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
          <div class="col-2">
            <div class="card">
              <div class="card-body">
                <p>
                  <div class="weather-forecast-day">${formatDay(
                    forecastDay.dt
                  )}</div>
                  <img
                  src="http://openweathermap.org/img/wn/${
                    forecastDay.weather[0].icon
                  }@2x.png"
                  alt=""
                  width=""
                  />
                  <div class="forecast-temperature"></div>
                  <span class="forecast-temperature-max">${Math.round(
                    forecastDay.temp.max
                  )}°</span>
                  <span class="forecast-temperature-min">${Math.round(
                    forecastDay.temp.min
                  )}°
                  </span>
                </p>
              </div>
            </div>
          </div>
          `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
