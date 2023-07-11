// Globals
var city
var state = ""
var country = "Au"
var owUrl="https://api.openweathermap.org"
var owApiKey = "fd223c8245ed1b33feec8296469d3041";

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
    owLocationData = owUrl +"/geo/1.0/direct?q="+ location + "&limit=1&apikey=" + owApiKey;
    console.log(owLocationData)
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
            var locationData;
            locationData = data[0]
            console.log(locationData)
            console.log(locationData.name)
            console.log(locationData.country)
            console.log(locationData.lat)
            console.log(locationData.lon)
            secondDataLookup(locationData.lat,locationData.lon)
        });

}

// Builds the Query String to reteive current weather in metric
function secondDataLookup(lat,lon) {
    owGeoData=owUrl+"/data/2.5/weather?lat="+lat+"&lon="+lon+"&appid="+ owApiKey+"&units=metric"
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
            console.log(data);
            var currentData;
            currentData = data
            weatherIcon="https://openweathermap.org/img/wn/"+currentData.weather[0].icon+".png"
            $("#crnt-city").text(currentData.name+" ("+dayjs.unix(currentData.dt).format('D/M/YYYY')+")")
            $("#crnt-city").append("<img class='reponsive-img' src=" + weatherIcon + ">")
            $("#crnt-temp").text("Temp: " + currentData.main.temp + "°C")
            $("#crnt-wind").text("Wind: " + currentData.wind.speed + " km/h")
            $("#crnt-humidity").text("Humidity: "+currentData.main.humidity+" %")
        });

}