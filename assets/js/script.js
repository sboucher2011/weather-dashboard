//-------------------------------------------------------
// Variables
//-------------------------------------------------------
//search side
var searchFormEl = document.querySelector('#city-form');
var citySearchEl = document.querySelector('#cityName');
var searchButtonEl = document.querySelector('#searchButton');
const searchedCities = JSON.parse(localStorage.getItem("searchedCities")) || [];
var savedLocationEl = document.querySelector('#savedLocations');

//current weather box
var cityNameEl = document.querySelector('#cityNameDateIcon');
var currentTempEl = document.querySelector('#currentTemp');
var currentWindEl = document.querySelector('#currentWind');
var currentHumidityEl = document.querySelector('#currentHumidity');
var currentUVEl = document.querySelector('#currentUV');
var currentImage = document.querySelector('#currentIcon');

//Forcast
var forcastDate_1 = document.querySelector('#titleDay-1');
var forcastTemp_1 = document.querySelector('#tempDay-1');
var forcastWind_1 = document.querySelector('#windDay-1');
var forcastHumidity_1 = document.querySelector('#humidityDay-1');

var forcastDate_2 = document.querySelector('#titleDay-2');
var forcastTemp_2 = document.querySelector('#tempDay-2');
var forcastWind_2 = document.querySelector('#windDay-2');
var forcastHumidity_2 = document.querySelector('#humidityDay-2');

var forcastDate_3 = document.querySelector('#titleDay-3');
var forcastTemp_3 = document.querySelector('#tempDay-3');
var forcastWind_3 = document.querySelector('#windDay-3');
var forcastHumidity_3 = document.querySelector('#humidityDay-3');

var forcastDate_4 = document.querySelector('#titleDay-4');
var forcastTemp_4 = document.querySelector('#tempDay-4');
var forcastWind_4 = document.querySelector('#windDay-4');
var forcastHumidity_4 = document.querySelector('#humidityDay-4');

var forcastDate_5 = document.querySelector('#titleDay-5');
var forcastTemp_5 = document.querySelector('#tempDay-5');
var forcastWind_5 = document.querySelector('#windDay-5');
var forcastHumidity_5 = document.querySelector('#humidityDay-5');

var forcastImage_1 = document.querySelector('#forcast-image-1');
var forcastImage_2 = document.querySelector('#forcast-image-2');
var forcastImage_3 = document.querySelector('#forcast-image-3');
var forcastImage_4 = document.querySelector('#forcast-image-4');
var forcastImage_5 = document.querySelector('#forcast-image-5');


//API 
var apiKey = "807260d60be85ac5c384c80bba453072";
var city = "orlando";

//Trackers for only displaying saved searches at correct times
var savedRun = "";
var previousCity = "";

//-------------------------------------------------------
// Event Listener
//-------------------------------------------------------
searchButtonEl.addEventListener("click", function() {
    event.preventDefault();

    console.log(citySearchEl.value)
    if (citySearchEl.value === "" || citySearchEl.value === " " || citySearchEl.value === null)  {
       //do nothing "!=" was not working for some reason
    } else {
        city = citySearchEl.value;
        getCurrentWeather();
        saveCity(city[0].toUpperCase() + city.slice(1));
        citySearchEl.value = "";
    }
    
});

$(document).on("click", ".saved", function() {
    var text = $(this)
        .text()
        .trim();
    
   city = text;
   previousCity = "yes";

   getCurrentWeather();
});

//-------------------------------------------------------
// Functions
//-------------------------------------------------------

var getCurrentWeather = function() {
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    fetch(apiURL).then(function(response) {
        response.json().then(function(data) {
            displayCurrentWeather(data);
        });
    });
    
    populatePastSearches();
    savedRun = "yes";
}

function displayCurrentWeather(cityInfo) {
    //temp
    var currentTemp = cityInfo.main.temp;
    currentTempEl.textContent = "Temp: " + currentTemp  + " \xB0 F";

    //date
    var currentDate = dateConvert(cityInfo.dt);

    //current condition
    var currentCondition = cityInfo['weather'][0]['main'];
    var currentConditionIcon = cityInfo['weather'][0]['icon'];
  
    //humidity
    var humidity = cityInfo.main.humidity;
    currentHumidityEl.textContent = "Humidity: " + humidity + " %";

    //wind speed
    var windSpeed = cityInfo.wind.speed;
    var windDirection = cityInfo.wind.deg;
    currentWindEl.textContent = "Wind: " + windSpeed + " MPH";

    //city name
    cityNameEl.textContent = city[0].toUpperCase() + city.slice(1) + " (" + currentDate + ")";

    currentImage.src = "http://www.openweathermap.org/img/wn/" + currentConditionIcon + "@2x.png";

    //get lat and long to get uvindex
    var cityLat = cityInfo.coord.lat;
    var cityLong = cityInfo.coord.lon;

    displayUVForcast(cityLat, cityLong)
}

function displayUVForcast(lat, long) {
     uvForcastURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat +  "&lon=" + long+ "&exclude={part}&appid=" + apiKey + "&units=imperial";

    fetch(uvForcastURL).then(function(response) {
        response.json().then(function(uvForcastData) {
            //uv index
            var uvIndex = uvForcastData.current.uvi;

            if (uvIndex >= 3) {
                currentUVEl.style.backgroundColor = "#FFFF00";
            }

            if (uvIndex >= 6) {
                currentUVEl.style.backgroundColor = "#AA0000";
            }
            
            currentUVEl.textContent =  uvIndex;

            displayForcast(uvForcastData);
        });
    });
}

function displayForcast(cityForcast) {

    //temp
    forcastTemp_1.textContent = "Temp: " + cityForcast.daily[0].temp.day + " \xB0 F"; 
    forcastTemp_2.textContent = "Temp: " + cityForcast.daily[1].temp.day + " \xB0 F"; 
    forcastTemp_3.textContent = "Temp: " + cityForcast.daily[2].temp.day + " \xB0 F"; 
    forcastTemp_4.textContent = "Temp: " + cityForcast.daily[3].temp.day + " \xB0 F"; 
    forcastTemp_5.textContent = "Temp: " + cityForcast.daily[4].temp.day + " \xB0 F"; 

    //date
    var currentDate_1 = dateConvert(cityForcast.daily[0].dt);
    var currentDate_2 = dateConvert(cityForcast.daily[1].dt);
    var currentDate_3 = dateConvert(cityForcast.daily[2].dt);
    var currentDate_4 = dateConvert(cityForcast.daily[3].dt);
    var currentDate_5 = dateConvert(cityForcast.daily[4].dt);
    
    forcastDate_1.textContent = currentDate_1;
    forcastDate_2.textContent = currentDate_2;
    forcastDate_3.textContent = currentDate_3;
    forcastDate_4.textContent = currentDate_4;
    forcastDate_5.textContent = currentDate_5;

    //icon
    var icon_1 = cityForcast.daily[0].weather[0].icon;
    var icon_2 = cityForcast.daily[1].weather[0].icon;
    var icon_3 = cityForcast.daily[2].weather[0].icon;
    var icon_4 = cityForcast.daily[3].weather[0].icon;
    var icon_5 = cityForcast.daily[4].weather[0].icon;

    forcastImage_1.src = "http://www.openweathermap.org/img/wn/" + icon_1 + "@2x.png";
    forcastImage_2.src = "http://www.openweathermap.org/img/wn/" + icon_2 + "@2x.png";
    forcastImage_3.src = "http://www.openweathermap.org/img/wn/" + icon_3 + "@2x.png";
    forcastImage_4.src = "http://www.openweathermap.org/img/wn/" + icon_4 + "@2x.png";
    forcastImage_5.src = "http://www.openweathermap.org/img/wn/" + icon_5 + "@2x.png";

    //wind
    forcastWind_1.textContent = "Wind: " + cityForcast.daily[0].wind_speed + "MPH";
    forcastWind_2.textContent = "Wind: " + cityForcast.daily[1].wind_speed + "MPH";
    forcastWind_3.textContent = "Wind: " + cityForcast.daily[2].wind_speed + "MPH";
    forcastWind_4.textContent = "Wind: " + cityForcast.daily[3].wind_speed + "MPH";
    forcastWind_5.textContent = "Wind: " + cityForcast.daily[4].wind_speed + "MPH";

    //humidty
    forcastHumidity_1.textContent = "Humidity: " + cityForcast.daily[0].humidity + " %";
    forcastHumidity_2.textContent = "Humidity: " + cityForcast.daily[1].humidity + " %";
    forcastHumidity_3.textContent = "Humidity: " + cityForcast.daily[2].humidity + " %";
    forcastHumidity_4.textContent = "Humidity: " + cityForcast.daily[3].humidity + " %";
    forcastHumidity_5.textContent = "Humidity: " + cityForcast.daily[4].humidity + " %";
}

function dateConvert(unixDate) {
    var myDate = new Date(unixDate*1000);

    var dd = String(myDate.getDate()).padStart(2, '0');
    var mm = String(myDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = myDate.getFullYear();
    
    myDate = mm + '/' + dd + '/' + yyyy;

    return(myDate);
}

var saveCity = function(cityName) {

    const searchedCity = {
        city: cityName,
    }

    searchedCities.push(searchedCity);

    localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
}

function populatePastSearches() {

    if (previousCity === "yes") {
        previousCity = "";
    } else {
        if (savedRun === "yes") {
            var previousCityEl = document.createElement("button");
            previousCityEl.id = "previousCity-"+searchedCities.length ;
            previousCityEl.className = "saved btn";
    
            previousCityEl.textContent = city[0].toUpperCase() + city.slice(1);
        
            previousCityEl.style.backgroundColor = '#D3D3D3';
            savedLocationEl.append(previousCityEl);
        } else {
            if (searchedCities.length > 0) {
                for (var j = 0; j < searchedCities.length; j++) {
                    
                   var previousCityEl = document.createElement("button");
                   previousCityEl.id = "previousCity-"+j;
                   previousCityEl.className = "saved btn";
        
                   previousCityEl.textContent = searchedCities[j].city;
               
                   previousCityEl.style.backgroundColor = '#D3D3D3';
                   savedLocationEl.append(previousCityEl);
                   
                }
            }
        }
    }
}

getCurrentWeather();