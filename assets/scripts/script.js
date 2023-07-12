// Globals
const owUrl = "https://api.openweathermap.org";
const owApiKey = "fd223c8245ed1b33feec8296469d3041";

/* var locationData = {}; */
var currentData = {};
var forecastData = {};

// Click handler for search button - won't work until the page is fully loaded
$(document).ready(function () {
    $("#search-btn").click(function () {
        let city=$("#city-name").val().trim().replaceAll(" ", "%20");
        firstDataLookup(city);
    });
});

// Check for Enter Key to search for city
$("#city-name").on("keypress", function (event) {
    if (event.key === "Enter") {
        $("#search-btn").click();
    }
});

// Event Handler for clicking in the City Name Input Field
$("#city-name").click(function () {
    $("#city-name").val("");
  });
  

// Builds the query string to search for the city and return lat/long
function firstDataLookup(city) {
    const state = "";
    const country = "Au";
    const location = city + "," + state + "," + country;
    const searchString = owUrl + "/geo/1.0/direct?q=" + location + "&limit=1&apikey=" + owApiKey;
    firstAPICall(searchString);
}

// Search ow for city location data
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
            firstDataSave(data[0]);
            secondDataLookup(data[0].lat, data[0].lon);
        });
}

// Builds the Query String to reteive current weather in metric
function secondDataLookup(lat, lon) {
    const owGeoData =
        owUrl +
        "/data/2.5/weather?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        owApiKey +
        "&units=metric";
    secondAPICall(owGeoData);
}

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

// Builds the Query String to reteive current weather in metric
function thirdDataLookup(lat, lon) {
    owGeoData =
        owUrl +
        "/data/2.5/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        owApiKey +
        "&units=metric";
    thirdAPICall(owGeoData);
}

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

function firstDataSave(apiData) {
    locationData = apiData;
    console.log(locationData);
    /*     console.log(locationData)
      console.log(locationData.name)
      console.log(locationData.country)
      console.log(locationData.lat)
      console.log(locationData.lon) */
}

function secondDataSave(currentData) {
    console.log(currentData);
    weatherIcon =
        "https://openweathermap.org/img/wn/" +
       currentData.weather[0].icon +
        ".png";
    $("#crnt-city").text(
       currentData.name +
        " (" +
        dayjs.unix(currentData.dt).format("D/M/YYYY") +
        ")"
    );
    $("#crnt-city").append("<img class='reponsive-img' src=" + weatherIcon + ">");
    $("#crnt-temp").text("Temp: " +currentData.main.temp + "°C");
    $("#crnt-wind").text("Wind: " +currentData.wind.speed + " km/h");
    $("#crnt-humidity").text("Humidity: " +currentData.main.humidity + " %");
}

function thirdDataSave(apiData) {
    console.log(apiData);
    console.log(locationData);
}
