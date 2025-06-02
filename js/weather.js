// weather.js
// Created by: Bruce Elgort / Spring 2023
// Student: Dank Mitchell

// Function to get Latitude and Longitude from the OpenWeather API

// Declare Variables
const weatherContent = document.querySelector('#weather')
const API_KEY = '07d9c4ddf3c3bc6db5a965686564db90' // Replace this with your API key

const getLatLon = (data,zipCode) => {
    // Check to see if an error occurred
    if (data.cod == '400' || data.cod == '404' || data.cod == '401' || zipCode.trim() == '') {
        // Show the initially hidden div
        weatherContent.style.display = 'block'
        weatherContent.innerHTML = 'Please enter a valid Zip Code'
        return // exit
    } else {
        // return an array of the latitude and longitude
        return [data.lat,data.lon]
    }
}

// Convert degrees to cardinal direction
function getCompassDirection(degrees) {
    // build array with cardinal directions in order
    const directions = [
        'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
    ];

    // Normalize degrees to 0-360
    degrees = (degrees + 360) % 360;

    const index = Math.floor((degrees + 11.25) / 22.5) % 16;
    return directions[index];
}

// weatherIcon to pair bootstrap icons with open weather api icon names
const weatherIcons = {
    '01d': 'wi-day-sunny',
    '02d': 'wi-day-cloudy',
    '03d': 'wi-cloud',
    '04d': 'wi-cloudy',
    '09d': 'wi-day-showers',
    '10d': 'wi-day-rain-mix',
    '11d': 'wi-day-lightning',
    '13d': 'wi-day-snow',
    '50d': 'wi-day-fog',
    '01n': 'wi-night-clear',
    '02n': 'wi-night-alt-cloudy',
    '03n': 'wi-cloud',
    '04n': 'wi-cloudy',
    '09n': 'wi-night-alt-showers',
    '10n': 'wi-night-alt-rain-mix',
    '11n': 'wi-night-alt-lightning',
    '13n': 'wi-night-alt-snow',
    '50n': 'wi-night-fog',
};

// weatherImage to pair background image with open weather api icon names
const weatherImage = {
    '01d': 'img/clear-sky.jpg',
    '02d': 'img/few-clouds.jpg',
    '03d': 'img/scattered-clouds.jpg',
    '04d': 'img/broken-clouds.jpg',
    '09d': 'img/shower-rain.jpg',
    '10d': 'img/rain.jpg',
    '11d': 'img/thunderstorm.jpg',
    '13d': 'img/snow.jpg',
    '50d': 'img/mist.jpg',
    '01n': 'img/clear-sky-n.jpg',
    '02n': 'img/few-clouds-n.jpg',
    '03n': 'img/scattered-clouds.jpg',
    '04n': 'img/broken-clouds.jpg',
    '09n': 'img/shower-rain.jpg',
    '10n': 'img/rain.jpg',
    '11n': 'img/thunderstorm.jpg',
    '13n': 'img/snow.jpg',
    '50n': 'img/mist.jpg'
};

// Function to get the current weather given the data and zip code
const getCurrentWeather = (data) => {
    // Check to see if the OpenWeather API returned an error
    if (data.cod == '400' || data.cod == '404' || data.cod == '401') {
        // show the initially hidden div
        weatherContent.style.display = 'block'
        weatherContent.innerHTML = 'Please enter a valid Zip Code'
        return; // exit
    }

    // Capitalize first letter of each word in Cloud coverage
    let cloudDesc = data.weather[0].description
    const words = cloudDesc.split(" ")

    // capitalize each word
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1)
    }
    // Join words back together
    cloudCoverage = words.join(" ")

    // define and add data into html
    const location = document.querySelector('#location')
    location.innerText = data.name

    // Temperatures
    const hiTemp = document.querySelector('#hiTemp')
    hiTemp.innerText = 'Hi: ' + Math.round(data.main.temp_max) + '° F'
    const currentTemp = document.querySelector('#currentTemp')
    currentTemp.innerText = Math.round(data.main.temp)
    const loTemp = document.querySelector('#loTemp')
    loTemp.innerText = 'Lo: ' + Math.round(data.main.temp_min) + '° F'
    const feelTemp = document.querySelector('#feelTemp')
    feelTemp.innerText = Math.round(data.main.feels_like) + '° F'

    // cloud cover icons and images
    const cloudCover = document.querySelector('#cloudCover')
    cloudCover.innerText = cloudCoverage
    const iconSymbol = data.weather[0].icon
    // recommend from chatGPT incase icon is not in weatherIcons object.
    const iconClass = weatherIcons[iconSymbol] || 'wi-na'
    const visual = document.querySelector('#icon')
    const weatherImg = document.querySelector('#weatherImg')
    const imgSrc = weatherImage[iconSymbol] || 'img/default.jpg'
    visual.innerHTML = `<i class="wi ${iconClass} display-2"></i>`
    weatherImg.style.backgroundImage = `url(${imgSrc}`

    // humidity and wind
    const humidity = document.querySelector('#humidity')
    humidity.innerText = data.main.humidity + '%'
    const wind = document.querySelector('#wind')
    const direction = getCompassDirection(data.wind.deg)
    wind.innerHTML =  Math.round(data.wind.speed) + 'mph ' + direction

    // sunrise and sunset
    const sunrise = document.querySelector('#sunrise')
    const sunriseTime = new Date(data.sys.sunrise * 1000)
    const sunset = document.querySelector('#sunset')
    const sunsetTime = new Date(data.sys.sunset * 1000)
    sunrise.innerText = sunriseTime.toLocaleTimeString('en-US', {hour: 'numeric',minute: '2-digit',hour12: true})
    sunset.innerText = sunsetTime.toLocaleTimeString('en-US', {hour: 'numeric',minute: '2-digit',hour12: true})
};

// This function must be used to display the 5 day weather forecast
const getWeatherForecast = (data) => {
    // Check to see if the OpenWeather API returned an error
    if (data.cod == '400' || data.cod == '404' || data.cod == '401') {
        // show the initially hidden div
        weatherContent.style.display = 'block'
        weatherContent.innerHTML = 'Please enter a valid Zip Code'
        return; // exit
    }
    // clear forcast div for new data
    const forecast = document.querySelector('#forecast')
    forecast.innerHTML = ''
    // insert HTML for daily forecast div
    data.list.forEach((dailyForecast, index) => {
    const forecastHTML = `                      
        <div class="border-top border-2 border-white py-5">
    <div class="row">
        <div class="col-12 text-start">
            <p id="dayE${index}"></p>
        </div>
    </div>
    <div class="row text-center">
        <div class="col-2">
            <div id="iconE${index}" class="mx-auto"></div>
            <p id="precipE${index}" class="blue pt-4" alt="rain icon"></p>
        </div>

        <div class="col-4">
            <p id="currentTempE${index}" class="display-2"></p>
            <div class="d-flex justify-content-center gap-1">
                <p id="hiTempE${index}" class='red'></p>
                <p>|</p>
                <p id="loTempE${index}" class="blue"></p>
            </div>
        </div>

        <div class="col-6 d-flex flex-column justify-content-center align-items-center">
            <div>
                <p id="humidityE${index}"></p>
                <p id="windE${index}"></p>
            </div>
            <div class="d-flex gap-2 justify-content-center">
                <p id="sunriseE${index}" class="d-flex gap-1"></p>
                <p id="sunsetE${index}" class="d-flex gap-1"></p>
            </div>
        </div>
    </div>
</div>
    `   
    forecast.insertAdjacentHTML('beforeend', forecastHTML)

    // assistance from ChatGPT and ProTip video to add days of the week and date
    let dateE = new Date(dailyForecast.dt * 1000)
    let weekdayE = dateE.toLocaleDateString('en-US', {weekday: 'short'})
    let dayDateE = dateE.toLocaleDateString('en-US', { day: 'numeric'})
    let monthE = dateE.toLocaleDateString('en-US', { month: 'long' })
    let dateStrE = `${weekdayE} | ${dayDateE} ${monthE}`
    const dayE = document.querySelector(`#dayE${index}`)
    dayE.innerText = dateStrE

    // cloud cover icons
    const iconSymbol = dailyForecast.weather[0].icon;
    const iconClass = weatherIcons[iconSymbol] || 'wi-na';
    const visualE = document.querySelector(`#iconE${index}`)
    visualE.innerHTML = `<i class="wi ${iconClass} display-5 pt-2"></i>`

    // Temperatures
    const currentTempE = document.querySelector(`#currentTempE${index}`)
    currentTempE.innerText = Math.round(dailyForecast.temp.day)
    const hiTempE = document.querySelector(`#hiTempE${index}`)
    hiTempE.innerHTML = `${Math.round(dailyForecast.temp.max)}° F`
    const loTempE = document.querySelector(`#loTempE${index}`)
    loTempE.innerHTML = `${Math.round(dailyForecast.temp.min)}° F`

    // Sunrise & Sunset
    const sunriseE = document.querySelector(`#sunriseE${index}`)
    const sunriseTimeE = new Date(dailyForecast.sunrise * 1000)
    const sunsetE = document.querySelector(`#sunsetE${index}`)
    const sunsetTimeE = new Date(dailyForecast.sunset * 1000)
    sunriseE.innerHTML = `<img src='./img/sunrise.png' height="25" alt="sunrise icon">${sunriseTimeE.toLocaleTimeString('en-US', {hour: 'numeric',minute: '2-digit',hour12: true})}`
    sunsetE.innerHTML = `<img src='./img/sunset.png' height="25" alt="sunset icon">${sunsetTimeE.toLocaleTimeString('en-US', {hour: 'numeric',minute: '2-digit',hour12: true})}`

    // Humidity, Wind, Precip
    const humidityE = document.querySelector(`#humidityE${index}`)
    humidityE.innerHTML = `<span class="faded">Humidity: </span>${dailyForecast.humidity}%`
    const windE = document.querySelector(`#windE${index}`)
    const directionE = getCompassDirection(dailyForecast.deg)
    windE.innerHTML =  `<span class="faded">Wind: </span>${Math.round(dailyForecast.speed)}mph ${directionE}`
    const precipE = document.querySelector(`#precipE${index}`)
    precipE.innerHTML = `<i class="wi wi-raindrop pe-2"></i>${Math.round(dailyForecast.pop * 100)}%`
    });

}


document.querySelector('#getWeather').addEventListener('click', () => {
    weatherContent.innerHTML = '' // clear out prior results
    let zipCode = document.querySelector('#zip').value
        
    // First call the geolocation API to get the latitude and longitude of the zip code
    let url = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${API_KEY}`
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            // Call the getLatLon function which returns an array
            const geo = getLatLon(data,zipCode)
            
            // Now get current weather data
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${geo[0]}&lon=${geo[1]}&appid=${API_KEY}&units=imperial`
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    // console.log(data);
                    // Call getWeather function
                    getCurrentWeather(data,geo[0],geo[1])
                }).catch((e) => {
                console.log(`This error occurred: ${e}`)
                })          
        }).catch((e) => {
            console.log(`This error occurred: ${e}`)
        });
});

document.querySelector('#getforecastbtn').addEventListener('click', () => {
    let zip = document.querySelector('#zip')
    zip = zip.value.trim()

    let url = `https://api.openweathermap.org/geo/1.0/zip?zip=${zip}&appid=${API_KEY}`

    fetch(url)
    .then (response => response.json())
    .then(data => {
        let lat = data["lat"]
        let lon = data["lon"]
        url = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=5&appid=${API_KEY}&units=imperial`;
        
        fetch(url)
        .then (response => response.json())
        .then (data => {
            console.log(data)
            getWeatherForecast(data);
        })
    }).catch((e) => {
        console.log(`This error occurred: ${e}`)
    })
})

// Auto load Portland Weather on page load
window.addEventListener('DOMContentLoaded', () => {
    const defaultZip = '97256';
    getForecastByZip(defaultZip);
    getCurrentWeatherByZip(defaultZip);
});

// Use same code as getWeather
function getCurrentWeatherByZip(zipCode) {
    let url = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const geo = getLatLon(data, zipCode);
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${geo[0]}&lon=${geo[1]}&appid=${API_KEY}&units=imperial`;
            return fetch(url);
        })
        .then(response => response.json())
        .then(data => {
            getCurrentWeather(data);
        })
        .catch(e => {
            console.log(`This error occurred: ${e}`);
        });
}

// Use same code as getForecast
function getForecastByZip(zip) {
    let url = `https://api.openweathermap.org/geo/1.0/zip?zip=${zip}&appid=${API_KEY}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const lat = data.lat;
        const lon = data.lon;
        url = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=5&appid=${API_KEY}&units=imperial`;
        return fetch(url);
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        getWeatherForecast(data);
    })
    .catch(e => {
        console.log(`This error occurred: ${e}`);
    });
}