let listGroup = $(".list-group");
let search = $("#search-input");
let initSearch = $("#init-search");
let searchUl = $(".searchUl");
let cityDisplay = $("#cityDisplay");
let cityName =  $("<h2></h2>");
let temp = $("<h3></h3>");
let img = $('<img id="dynamic" src="">');
let uvContainer = $("<div></div>").addClass("uvContainer");
let uvVal = $("<h3></h3>");

let humidityDisplay = $("<h3></h3>");
let windSpeedDisplay = $("<h3></h3");
let uv = $("<h3></h3>");
let forcastDisplay = $("#forcast");
let searchResult = [];

let apiKey = "&appid=b0cf6c6bc6f91698b7db2846b91237aa";
let endPoint = "https://api.openweathermap.org/data/2.5/weather?q=";
let uvEndPoint = "https://api.openweathermap.org/data/2.5/uvi?lat=";
let forcastEndPoint = "https://api.openweathermap.org/data/2.5/forecast?q="
console.log(localStorage);

function history() {
    let history = JSON.parse(localStorage.getItem("result"));
    for (var i = 0; i < history.length; i++){
        let searchLi = $("<li></li>");
        searchLi.text(history[i]);
        searchUl.append(searchLi);
    }
    let clearBtn = $("<button>");
    listGroup.append(clearBtn);
    clearBtn.text("Clear").on('click', function() {
        searchUl.text("");
    })
}

function renderList () {
    for (var i = 0; i < searchResult.length; i++){
        var onList = searchResult[i];     
    }
    let searchLi = $("<li></li>");
        searchLi.text(onList);
        searchUl.append(searchLi);
        searchLi.attr("data-index", i);
    console.log(localStorage);
}

searchUl.on('click', "li", function(event) {
    const city = event.target.textContent;
    searchCity(city);
})

function storeResult() {
    localStorage.setItem("result", JSON.stringify(searchResult))
}

function searchCity(city) {
    let searchOutput = city ? city : search.val();
    let icon = "https://openweathermap.org/img/w/";
    let current = moment().format("MMM-Do-YYYY");
    
    fetch(endPoint + searchOutput + apiKey)
    .then(response => response.json())
    .then(data => {
  
        var cityNameContainer = $("<div></div>").addClass("cityNameContainer");
        let iconCode = data.weather[0].icon;
        let iconUrl = icon + iconCode + ".png";
        //display the value
        
        img.attr('src', iconUrl);
        cityName.text(data.name + " (" + current + ") ");

        let tempF = data.main.temp;
        tempF = tempF - 273.15;
        tempF = tempF * 9/5 + 32;
        tempF = Math.ceil(tempF);
        temp.text("Temperature: " + tempF + "°F");
        humidityDisplay.text("Humidity: " + data.main.humidity + "%");
        windSpeedDisplay.text("Wind Speed: " + data.wind.speed + " MPH");
        
        cityDisplay.append(cityNameContainer);
        cityNameContainer.append(cityName);
        cityNameContainer.append(img);
        cityDisplay.append(temp);
        cityDisplay.append(humidityDisplay);
        cityDisplay.append(windSpeedDisplay);

        var lat = data.coord.lat;
        var lon = data.coord.lon;
        fetch(uvEndPoint + lat + "&lon=" + lon + apiKey)
        .then(response => response.json())
        .then(data => {
            
            uvLevel = data.value;
            if (uvLevel < 3) {
                uvVal.attr("class", "uvLevelLow");
            } else if (uvLevel >= 3 && uvLevel < 8) {
                uvVal.attr("class", "uvLevelModerate");
            } else {
                uvVal.attr("class", "uvLevelHigh");
            }
            uv.text("UV Index: ");
            uvVal.text(uvLevel);
            
            cityDisplay.append(uvContainer);
            uvContainer.append(uv);
            uvContainer.append(uvVal);
        })
    })

    fetch(forcastEndPoint + searchOutput + apiKey)
    .then(response => response.json())
    .then(data => { 
        forcastDisplay.text("");
        var count = 1;
        for (var i = 0; i < 4; i++) {
            
            let forcastBox = $("<div class='forcastBox'></div>");
            let forcastIconCode = data.list[count].weather[0].icon;
            let forcastIconUrl = icon + forcastIconCode + ".png";
            let days = moment().add(i+1, 'days').format("L");
            let forcastImg = $('<img id="weatherIcon" src="">');
            let forcastTempDisplay = $("<h3></h3>");
            let forcastTemp = data.list[count].main.temp;
            let forcastHumidityDisplay = $("<h3></h3>");
            let forcastHumidity = data.list[count].main.humidity;
            let forcastDay = $("<h3></h3");

            forcastImg.attr('src', forcastIconUrl);
            
            forcastTemp = forcastTemp - 273.15;
            forcastTemp = forcastTemp * 9/5 + 32;
            forcastTemp = Math.ceil(forcastTemp);
            forcastTempDisplay.text("Temperature: " + forcastTemp + "°F");
            forcastHumidityDisplay.text("Humidity: " + forcastHumidity + "%");
        
            forcastDisplay.append(forcastBox);
            forcastBox.append(forcastDay.text(days));
            forcastBox.append(forcastImg);
            forcastBox.append(forcastTempDisplay);
            forcastBox.append(forcastHumidityDisplay);

            count = count + 9;
        }
    })

    if (searchOutput === "") {
        return;
      }
    searchResult.push(searchOutput);

    storeResult();

    if (!city) renderList();
}

initSearch.on("click", function (event) {
    event.preventDefault();
    searchCity();
});

history();