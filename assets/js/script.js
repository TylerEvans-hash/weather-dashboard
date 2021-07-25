const searchFormEl = document.querySelector("#search-form");
const cityInputEl = document.querySelector("#city-name");
const recentContainerEl = document.querySelector("#recent-container");

const recentCities = [];

const displayRecent = function (event) {
    event.preventDefault();
    const currentWeatherEl = document.querySelector("#current-weather");

    const city = cityInputEl.value.trim();
    recentCities.push(city);

    //console.log(cityInputEl.value.trim());
    // console.log(city);
    // console.log(recentCities);

    recentContainerEl.textContent = "";

    for (let i=0; i <= recentCities.length; i++) {

        const citySpanEl = document.createElement("span");
        citySpanEl.setAttribute("class", "row");

        const newButtonEl = document.createElement("button");
        newButtonEl.classList = "recentSearchBtn btn btn-primary";
        newButtonEl.setAttribute("type", "submit");
        newButtonEl.textContent = recentCities[i];

        citySpanEl.appendChild(newButtonEl);
        recentContainerEl.appendChild(citySpanEl);
        // console.log(recentCities);
    };

    localStorage.setItem('recent-cities', recentCities);
};

const displayCurrent = function(weatherData) {
    const currentCity = document.createElement("h2");

    currentCity.classList = "card-title";
    currentCity.textContent = "Current City"

    currentWeatherEl.appendChild(currentCity);
};

const getWeatherData = function (event) {
    const apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=112.0740&lon=33.4484&appid=0c7ee97e6c5905c597220c21f55520b4';

    fetch(apiUrl)
        .then(function(response) {
            if(response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                    displayCurrent(data);
                })
            }
        })
};

//getWeatherData();
displayCurrent();

searchFormEl.addEventListener("submit", displayRecent);