// Globals
const owUrl = "https://api.openweathermap.org";
const owApiKey = "fd223c8245ed1b33feec8296469d3041";
const ow1ApiKey = "807c3deef800497237a093dee3b33208"
const collection = "weather"
var locationData = {};
var currentData = {};
var forecastData = {};
var cities = [];






// Read Cities Collection from Local Storage
// Reveal Cities Buttons
cities = JSON.parse(localStorage.getItem(collection));
displayCities();

// Click handler for search button - won't work until the page is fully loaded
// Handle space characters & clear field
$(document).ready(() => {
    $("#search-btn").click(() => {
        firstDataLookup($("#location").val().trim().replaceAll(" ", "%20"));
    });
});

// Add Cards to display Forecast Data
addCards();

// Click handler for:
//  - load Saved City Data
//  - delete Saved City from Collection 
$('.city-list').click((event) => {
    // delete City
    if ($(event.target).hasClass("button-delete")) {
        let j = event.target.parentElement.value;
        if (cities[j][0] === $('#today-city').text()) {
            $('#today-city').text("");
            $('#today-date').text("");
            $('#today-icon').attr('src', "");
            $('#current-temp').text('');
            $('#current-wind').text('');
            $('#current-humidity').text('');
        }
        cities.splice(
            cities.findIndex((x) => x.includes(cities[j][1])),
            1
        );
        localStorage.setItem(collection, JSON.stringify(cities));
        displayCities();
    }
    // Load City Data
    if ($(event.target).hasClass("saved-cities")) {
        let j = event.target.value;
        locationData.name = cities[j][0];
        locationData.lat = cities[j][1];
        locationData.lon = cities[j][2];
        secondDataLookup(locationData.lat, locationData.lon);
    }

})

// Check for Enter Key to search for location
$("#location").on("keypress", (event) => {
    if (event.key === "Enter") {
        $("#search-btn").click();
    }
});

// Event Handler for clicking in the Location Input Field
$("#location").click(() => {
    $("#location").val("");
});


// Builds the query string to search for the city and return lat/long
// will accept city, city/country or city/state/country, delimited by commas
function firstDataLookup(target) {
    let state;
    let country;
    let city;
    if (target.includes(",")) {
        // check if state &/or country supplied
        let fullLocation = target.split(",");

        if (fullLocation.length === 2) {
            // City & Country
            city = fullLocation[0];
            state = fullLocation[1];
            country = fullLocation[2];
        } else if (fullLocation.length === 3) {
            // City, State & Country
            city = fullLocation[0];
            state = "";
            country = fullLocation[1];
        } else {
            // Invalid location data supplied
        }
    } else {
        city = target;
        state = "";
        country = "au";
    }
    const searchString = `${owUrl}/geo/1.0/direct?q=${city},${state},${country}&limit=1&apikey=${owApiKey}`;
    firstAPICall(searchString);
}

// Builds the Query String to retrieve current weather
// - in metric
function secondDataLookup(lat, lon) {
    const searchString = `${owUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${owApiKey}&units=metric`;
    secondAPICall(searchString);
}

// Builds the Query String to retrieve weather forecast
// - in metric
function thirdDataLookup(lat, lon) {
    const searchString = `${owUrl}/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${owApiKey}&units=metric`;
    thirdAPICall(searchString);
}

// Search OpenWeather for location data
function firstAPICall(queryString) {
    fetch(queryString, {
        method: "GET",
        credentials: "same-origin",
        redirect: "follow",
    })
        .then(function (response) {
                return response.json();   
        })
        .then(function (data) {
            if (data.length > 0) {
                firstDataSave(data[0]);
                secondDataLookup(locationData.lat, locationData.lon);
            } else {
                console.log('error')
                $("#modal-header").text(
                    "We can't find the location you entered: " + $("#location").val().trim()
                );
                $("#message").append(
                    '<p>Please check the name of the location and try again</p>'
                );
                $(".modal-close").text("Try Again");
                $('.modal').modal();
                $("#modal").modal("open");
                return
            }
        });
}

// Search OpenWeather for Current Weather Conditions
function secondAPICall(queryString) {
    fetch(queryString, {
        method: "GET",
        credentials: "same-origin",
        redirect: "follow",
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            secondDataSave(data);
            thirdDataLookup(locationData.lat, locationData.lon);
        });
}

// Search OpenWeather for 5 Day Weather Forecast
function thirdAPICall(queryString) {
    fetch(queryString, {
        method: "GET",
        credentials: "same-origin",
        redirect: "follow",
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            thirdDataSave(data);
        });
}

//Save location data to variable
function firstDataSave(apiData) {
    locationData.name = apiData.name;
    locationData.lat = apiData.lat;
    locationData.lon = apiData.lon;
}

// Save current weather data to variable
function secondDataSave(currentData) {
    let weatherIcon = `https://openweathermap.org/img/wn/${currentData.weather[0].icon}.png`;
    $("#today-city").text(currentData.name)
    $("#today-date").text("(" + dayjs.unix(currentData.dt).format("D/M/YYYY") + ")");
    $("#today-icon").attr('src', weatherIcon);
    $("#current-temp").text(`Temp: ${currentData.main.temp}°C`);
    $("#current-wind").text(`Wind: ${currentData.wind.speed} km/h`);
    $("#current-humidity").text(`Humidity: ${currentData.main.humidity} %`);
    addToCollection(locationData.name, locationData.lat, locationData.lon);
    $('#location').val('')
}

//Save location data to variable
function thirdDataSave(apiData) {
    let start
    let now = dayjs().format("D/M/YYYY")
    if (now === dayjs.unix(apiData.daily[0].dt).format("D/M/YYYY")) {
        start = 1
    } else {
        start = 0
    }
    addCardDetails();
    fillCardDetails();

    // Create Elements to hold Weather Forecast Data
    function addCardDetails() {
        for (let i = 1; i < 6; i++) {
            $(`#card${i}`).empty();

            $(`#card${i}`).append(`<ul id="sheet${i}" class="detail-list"></ul>`);
            $(`#sheet${i}`).append(`<li id="date${i}" class="detail forecast-date">Date</li>`);
            $(`#sheet${i}`).append(`<li id="icon${i}" class="detail forecast-item"></li>`);
            $(`#sheet${i}`).append(`<li id="temp${i}" class="detail forecast-item">temp</li>`);
            $(`#sheet${i}`).append(`<li id="wind${i}" class="detail forecast-item">wind</li>`);
            $(`#sheet${i}`).append(`<li id="humidity${i}" class="detail forecast-item">humidity</li>`);
        }
    }
    // Add Data to Elements to show Weather Forecast Data
    function fillCardDetails() {
        for (let i = start; i < start + 5; i++) {
            console.log(apiData.daily[i])
            //looping through days to find & publish daily data
            $(`#date${i}`).text(dayjs.unix(apiData.daily[i].dt).format("D/M/YYYY"));
            let weatherIcon = `https://openweathermap.org/img/wn/${apiData.daily[i].weather[0].icon}.png`;
            $(`#icon${i}`).append(`<img src="${weatherIcon}"</img>`);
            $(`#temp${i}`).text(`Temp: ${apiData.daily[i].temp.max} ºC`);
            $(`#wind${i}`).text(`Wind: ${apiData.daily[i].wind_speed} km/h`);
            $(`#humidity${i}`).text(`Humidity: ${apiData.daily[i].humidity} %`);
        }
    }
}

// Add City to Cities Collection if it hasn't been added already - checking latitude
// Update displayed list of cities
function addToCollection(city, lat, lon) {
    if (cities === null) {
        cities = [[city, lat, lon]];
    } else {
        if (cities.findIndex((x) => x.includes(lat)) === -1) {
            cities.push([city, lat, lon]);
            cities.sort();
        }
    }
    localStorage.setItem(collection, JSON.stringify(cities));
    displayCities();
}

// Add the Cities Collection to Favourite Buttons
// Clear cities list & repopulate
function displayCities() {
    if (cities !== null) {
        $('.saved-cities').remove()
        for (let i = 0; i < cities.length; i++) {
            addCityButton(i)
            $(`#city${i}`).text(cities[i][0]).append('<i class="material-icons medium button-delete">delete</i>');

        }
    }
}

function addCityButton(k) {
    $('.city-list').append(`<button id="city${k}" value="${k}" class="saved-cities waves-effect waves-light grey btn"></button>`)
}

// Add Cards to display Forecast Data
function addCards() {
    for (let i = 1; i < 6; i++) {
        $('#card-list').append(`<div id="card${i}" class="card"></div>`);
    }
}


