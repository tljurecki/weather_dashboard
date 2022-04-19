var apiKey = "99be757011866a1f6a12a906bb2738d4";
var searchBtnEl = $("#search-btn");
var searchTerm = $("#input");


var searchHistory = [];

// displays current date and date for next five days
var dateDisplay= function () {
    // current day
    var currentDay = moment().format("ddd M/DD/YYYY");
    $("#current-date").text("("+currentDay+")");

   //iterate through five days
    var day1 = moment().add(1, "day").format("ddd M/DD/YYYY");
    $("#date-1").text(day1);
    
   
    var day2 = moment().add(2 , "day").format("ddd M/DD/YYYY");
    $("#date-2").text(day2);

    
    var day3 = moment().add(3, "day").format("ddd M/DD/YYYY");
    $("#date-3").text(day3);

   
    var day4 = moment().add(4, "day").format("ddd M/DD/YYYY");
    $("#date-4").text(day4);

    
    var day5 = moment().add(5, "day").format("ddd M/DD/YYYY");
    $("#date-5").text(day5);
}

// search button 'enter' listener
//this method was found on stackoverflow
searchTerm.keypress(function(event) {
    if (event.which == 13) {
        event.preventDefault();
        searchBtnEl.click();
    }
})


searchBtnEl.click(function() {
    
    var searchTerm = $("#input").val().trim();
    
    getCoord(searchTerm);
    
    $("#input").val("");
})

$("#search-history-container").on("click", "button", function(event) {
    var cityName = event.target.innerText;

    
    getCoord(cityName);
})

// gets coordinates from user search to get lat/lon for api call
var getCoord = function(cityName) {
    
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + apiKey;
    
    
    fetch(apiUrl).then(function(repsonse) {
        if (repsonse.ok) {
            repsonse.json().then(function(response) {
                console.log(response);
                
                
                var cityName = response[0].name;
                $("#city").text(cityName);
                
                
                saveSearch(cityName);
                
                // grab lat/lon 
                var lat = response[0].lat
                var lon = response[0].lon
                displaySearch(lat, lon);

                // display history and update with new button
                displayHistory();
            })
        }
    })
} 

// function to fetch and display api results
var displaySearch = function(lat, lon) {
    
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey
    
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(response) {
                console.log(response);
                
                
                var weatherIcon = response.current.weather[0].icon;
                var iconUrl = "http://openweathermap.org/img/wn/"+weatherIcon+"@2x.png"
                $("#current-icon").attr("src", iconUrl);
                
                
                var temp = response.current.temp + " °F";
                $("#current-temp").text(temp);
                
                
                var wind = response.current.wind_speed + " MPH";
                $("#current-wind").text(wind);
                
                
                var humidity = response.current.humidity + "%";
                $("#current-humidity").text(humidity);
                
               
                var uvi = response.current.uvi;
                $("#current-uv").text(uvi);
                
                if (uvi >= 0 && uvi <= 2) {
                    $("#current-uv").removeClass()
                    $("#current-uv").addClass("uv-favorable")
                } else if (uvi > 2 && uvi <= 7) {
                    $("#current-uv").removeClass()
                    $("#current-uv").addClass("uv-moderate")
                } else {
                    $("#current-uv").removeClass()
                    $("#current-uv").addClass("uv-severe")
                }
                
                
                for (var i = 0; i < 5; i++) {
                    
                    var weatherIcon = response.daily[i].weather[0].icon;
                    var iconUrl = "http://openweathermap.org/img/wn/"+weatherIcon+"@2x.png"
                    $("#icon-" + (i + 1)).attr("src", iconUrl);
                    
                   
                    var temp = response.daily[i].temp.max + " °F";
                    $("#temp-" + (i + 1)).text(temp);
                    
                    
                    var wind = response.daily[i].wind_speed + " MPH";
                    $("#wind-" + (i + 1)).text(wind);
                    
                    
                    var humidity = response.daily[i].humidity + "%";
                    $("#humidity-" + (i + 1)).text(humidity);
                }
            })
        }
    })
}

// save search to localstorage
var saveSearch = function(cityName) {
   
    searchHistory.push(cityName);
    
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

var displayHistory = function() {
   
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));

    if (!searchHistory) {
        searchHistory = [];
    }

    // clear old buttons
    $("#search-history-container").html("");

   
    var newSearchHistory = [...new Set(searchHistory)];

    
    for (var i = newSearchHistory.length-1; i >= newSearchHistory.length-7; i--) {

        
        if (newSearchHistory[i]) {
            
            var cityName = newSearchHistory[i];
            $("<button class='btn' type='button'>"+cityName+"</button>").appendTo("#search-history-container");
        }
    }
}

setInterval(dateDisplay, 3600000);

dateDisplay();

displayHistory();