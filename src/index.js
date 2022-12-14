let apiKey = `2ec01c036c5655e9948bd34d81a48b60`;

document
  .querySelector("#current-btn")
  .addEventListener("click", getCurrentLocation);

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
             <div class="col-2 ">
              <div>
                ${formatDay(forecastDay.dt)}</div>
              <img  src="http://openweathermap.org/img/wn/${
                forecastDay.weather[0].icon
              }@2x.png" alt="icon" id="icon" width="42px">
              <div class="daily-temp">
                <span 
                 class="max-temp" id="max-temp-${index}">
                 ${Math.round(forecastDay.temp.max)}°</span>
                <span class="min-temp" id="min-temp-${index}">
                ${Math.round(forecastDay.temp.min)}°</span>
              </div>
            </div>
            `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

async function getForecast(coordinates) {
  console.log(coordinates.lon);
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude={part}&appid=${apiKey}&units=metric`;
  console.log(apiUrl);
  await axios.get(apiUrl).then(displayForecast);
}

function showWeather(response) {
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;

  document.querySelector("#city").innerHTML = response.data.name;

  celsiusTemp = Math.round(response.data.main.temp);

  document.querySelector("#temperature").innerHTML = celsiusTemp;

  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity").innerHTML = Math.round(
    response.data.main.humidity
  );

  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );

  document.querySelector("#date").innerHTML = formatDate(
    response.data.dt * 1000
  );

  getForecast(response.data.coord);
}

async function searchCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  await axios.get(apiUrl).then(showWeather);
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchCity(city);
}

function convertTemperature(value, unit) {
  if (unit === "celsius") {
    return Math.round(((value - 32) * 5) / 9);
  }

  if (unit === "fahrenheit") {
    return Math.round((value * 9) / 5 + 32);
  }
}

function changeCurrentTemperature(unit) {
  let temperature = 0;

  if (unit === "celsius") {
    temperature = celsiusTemp;
  } else if (unit === "fahrenheit") {
    temperature = convertTemperature(celsiusTemp, unit);
  }

  document.querySelector("#temperature").innerHTML = temperature;
}

function changeDaysTemperature(unit) {
  const minTempConverted = [];
  const maxTempConverted = [];
  let dailyTempMin = document.querySelectorAll(".min-temp");
  let dailyTempMax = document.querySelectorAll(".max-temp");

  // dailyTempMin.forEach((data) => {
  //   minTempConverted.push(convertTemperature(parseInt(dailyTempMin[i].childNodes[0].nodeValue), unit));
  // });

  // dailyTempMax.forEach((data) => {
  //   maxTempConverted.push(convertTemperature(parseInt(dailyTempMin[i].childNodes[0].nodeValue), unit));
  // });

  console.log(dailyTempMin[0].childNodes[0].nodeValue);

  for (let i = 0; i <= 5; i++) {
    // document.querySelector(
    //   `#max-temp-${i}`
    // ).innerHTML = `${maxTempConverted[i]}°`;

    document.querySelector(`#max-temp-${i}`).innerHTML = `${convertTemperature(
      parseInt(dailyTempMax[i].childNodes[0].nodeValue),
      unit
    )}°`;
    document.querySelector(`#min-temp-${i}`).innerHTML = `${convertTemperature(
      parseInt(dailyTempMin[i].childNodes[0].nodeValue),
      unit
    )}°`;
  }
}

function changeTemperature(event, unit) {
  event.preventDefault();
  let fahrenheitLink = document.querySelector("#fahrenheit-link");
  let celsiusLink = document.querySelector("#celsius-link");

  if (unit === "celsius") {
    celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");
    celsiusLink.setAttribute("disabled", true);
    fahrenheitLink.setAttribute("disabled", false);
  } else if (unit === "fahrenheit") {
    fahrenheitLink.classList.add("active");
    celsiusLink.classList.remove("active");
    fahrenheitLink.setAttribute("disabled", true);
    celsiusLink.setAttribute("disabled", false);
  }

  changeCurrentTemperature(unit);
  changeDaysTemperature(unit);
}

function getPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showWeather);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getPosition);
}

function getCurrentLocationNow() {
  navigator.geolocation.getCurrentPosition(getPosition);
}
searchCity("Kyiv");
getCurrentLocationNow();
