// Globals
var city
var state = ""
var country = "Au"
var owUrl = "https://api.openweathermap.org"
var owApiKey = "fd223c8245ed1b33feec8296469d3041";

var owLocationData = {};
var owCurrentData = {}
var forecastData = {}

$(document).ready(function () {
    $("#search-btn").click(function () {
        city = $("#city-name").val().trim()
        firstDataLookup(city);
    });
});

// Check for Enter Key to search for city
$("#city-name").on("keypress", function (event) {
    if (event.key === "Enter") {
        $("#search-btn").click();
    }
});

// Builds the query string to search for the city and return lat/long
function firstDataLookup(city) {
    var location = city + "," + state + "," + country
    owLocationData = owUrl + "/geo/1.0/direct?q=" + location + "&limit=1&apikey=" + owApiKey;
    firstAPICall(owLocationData);
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
            var locationInfo
            locationInfo = data[0]
            firstDataSave(data[0]);
            secondDataLookup(owLocationData.lat, owLocationData.lon)
        });

}

// Builds the Query String to reteive current weather in metric
function secondDataLookup(lat, lon) {
    owGeoData = owUrl + "/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + owApiKey + "&units=metric"
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
            var currentData;
            currentData = data
            secondDataSave(currentData)
            thirdDataLookup(owLocationData.lat, owLocationData.lon)
        });

}

// Builds the Query String to reteive current weather in metric
function thirdDataLookup(lat, lon) {
    owGeoData = owUrl + "/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + owApiKey + "&units=metric"
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
            var currentData;
            currentData = data
            thirdDataSave(currentData)
        });

}

function firstDataSave(apiData) {
    owLocationData = apiData
    console.log(owLocationData)
/*     console.log(owLocationData)
    console.log(owLocationData.name)
    console.log(owLocationData.country)
    console.log(owLocationData.lat)
    console.log(owLocationData.lon) */

}

function secondDataSave(apiData) {
    owCurrentData = apiData
    console.log(owCurrentData)
    weatherIcon = "https://openweathermap.org/img/wn/" + owCurrentData.weather[0].icon + ".png"
    $("#crnt-city").text(owCurrentData.name + " (" + dayjs.unix(owCurrentData.dt).format('D/M/YYYY') + ")")
    $("#crnt-city").append("<img class='reponsive-img' src=" + weatherIcon + ">")
    $("#crnt-temp").text("Temp: " + owCurrentData.main.temp + "°C")
    $("#crnt-wind").text("Wind: " + owCurrentData.wind.speed + " km/h")
    $("#crnt-humidity").text("Humidity: " + owCurrentData.main.humidity + " %")
}

function thirdDataSave(apiData) {
    forecastData=apiData
    console.log (forecastData)
}