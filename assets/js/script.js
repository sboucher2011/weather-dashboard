var apiKey = "807260d60be85ac5c384c80bba453072";

var city = "orlando";

var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";

function getCurrentWeather() {
    fetch(apiURL).then(function(response) {
        response.json().then(function(data) {
            displayCurrentWeather(data);
        });
    });
}

function displayCurrentWeather(cityInfo) {
    //temp
    var currentTemp = cityInfo.main.temp;

    //date
    var epoch = cityInfo.dt;
	var myDate = new Date(epoch*1000);
    //var currentTime = document.write(myDate.toGMTString()+"<br>"+myDate.toLocaleString());

    //current condition
    var currentCondition = cityInfo['weather'][0]['main'];
    var currentConditionIcon = cityInfo['weather'][0]['icon'];
    //http://openweathermap.org/img/wn/10d@2x.png
    //10d is the condition

    //humidity
    var humidity = cityInfo.main.humidity;

    //wind speed
    var windSpeed = cityInfo.wind.speed;
    var windDirection = cityInfo.wind.deg;

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

            displayForcast(uvForcastData);
            console.log(uvForcastData);
        });
    });
}

function displayForcast(cityForcast) {

    for (var i = 0; i < 5; i++) {
        console.log(cityForcast.daily[i].temp.day)
    }
    //date

    //icon
    
    //temp

    //wind

    //humidty
}

getCurrentWeather();