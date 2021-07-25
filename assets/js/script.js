const searchFormEl = document.querySelector("#search-form");
const cityInputEl = document.querySelector("#city-name");
const recentContainerEl = document.querySelector("#recent-container");
const dailyForecastEl = document.querySelector("#daily-forecast");

const apiKey = '0c7ee97e6c5905c597220c21f55520b4';
const recentCities = [];

const displayRecent = function (city) {
    recentCities.push(city);

    recentContainerEl.textContent = "";

    for (let i = 0; i <= recentCities.length; i++) {
        const citySpanEl = document.createElement("span");
        citySpanEl.setAttribute("class", "row");

        const newButtonEl = document.createElement("button");
        newButtonEl.classList = "recentSearchBtn btn btn-primary";
        newButtonEl.setAttribute("type", "submit");
        newButtonEl.textContent = recentCities[i];

        citySpanEl.appendChild(newButtonEl);
        recentContainerEl.appendChild(citySpanEl);
    };

    localStorage.setItem('recent-cities', recentCities);
};

const displayCurrent = (weatherData) => {
    $('div').remove('#weather-card');
    const currentDate = new Date();

    const current = (`
        <div class="card" id="weather-card">
            <div class="card-body">
                <div class="card-title">
                   <h2>${weatherData.cityName}</h2>
                </div>            
                <ul>
                    <li>
                        <a>Description: ${weatherData.description}</a>
                    </li>
                    <li>                        
                        <a>Current Temperature: ${weatherData.temp}°F</a>
                    </li>
                    <li>
                        <a>Wind Speed: ${weatherData.wind} MPH</a>
                    </li>
                    <li>
                        <a>Humidity: ${weatherData.humidity}%</a>
                    </li>
                </ul>
            </div>
        </div>
    `);

    $('#current-weather').append(current);
};

const displayDaily = (dailyForecast) => {
    $('div').remove('#daily-container');
    
    const dailyContainerEl = document.createElement('div')
    dailyContainerEl.setAttribute('id', 'daily-container');
    dailyForecastEl.appendChild(dailyContainerEl);

    const currentDate = new Date(); 

    for (let i = 1; i <= 5; i++) {
        $('#daily-forecast').remove('#daily-card');

        currentDate.setDate(currentDate.getDate() + 1);
        const nextDate = currentDate.toDateString();

        let daily = {
            temp: dailyForecast[i].temp.day,
            description: dailyForecast[i].weather[0].description,
            wind: dailyForecast[i].wind_speed,
            humidity: dailyForecast[i].humidity
        };

        const dailyForecastEl = (`
            <div class="card" id="daily-card${i}">
                <div class="card-body">
                <div class="card-title">
                     <h4>Forecast for: ${nextDate}</h4>
                </div>
                    <ul>
                        <li>
                            <a>Description: ${daily.description}</a>
                        </li>
                        <li>                        
                            <a>Current Temperature: ${daily.temp}°F</a>
                        </li>
                        <li>
                            <a>Wind Speed: ${daily.wind} MPH</a>
                        </li>
                        <li>
                            <a>Humidity: ${daily.humidity}%</a>
                        </li>
                    </ul>
                </div>
            </div>
        `);
        $('#daily-container').append(dailyForecastEl);
    }
};

const getWeatherData = function (coord) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly,current&units=imperial&appid=${apiKey}`;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayDaily(data.daily);
                });
            }
        })
};

const getCityData = function (event) {
    event.preventDefault();
    const cityName = cityInputEl.value.trim();
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey} `

    fetch(apiUrl)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            const iconLocation = data.weather[0].icon;
            const iconUrl = `<img src="https://openweathermap.org/img/w/${iconLocation}.png" alt="Current Weather image" />`;

            const currentWeather = {
                temp: data.main.temp,
                cityName: data.name,
                icon: iconUrl,
                wind: data.wind.speed,
                humidity: data.main.humidity,
                description: data.weather[0].description
            };

            const coord = {
                lon: data.coord.lon,
                lat: data.coord.lat
            };
            getWeatherData(coord);

            displayCurrent(currentWeather);
            displayRecent(currentWeather.cityName);
        });
};

searchFormEl.addEventListener("submit", getCityData);