let listGroup = $(".list-group");
let search = $("#search-input");
let initSearch = $("#init-search");
let searchUl = $("ul");
let cityDisplay = $("#cityDisplay");
let cityName =  $("<h2></h2>");
let temp = $("<h3></h3>");
let img = $('<img id="dynamic" src="">');
let humidityDisplay = $("<h3></h3>");
let windSpeedDisplay = $("<h3></h3");
let searchResult = [];

var apiKey = "&appid=b0cf6c6bc6f91698b7db2846b91237aa";
var endPoint = "http://api.openweathermap.org/data/2.5/weather?q=";


function renderList () {
    for (var i = 0; i < searchResult.length; i++){
        var onList = searchResult[i];     
    }
    let searchLi = $("<li></li>");
        searchLi.text(onList);
        searchUl.append(searchLi);
        searchLi.attr("data-index", i);
    console.log(localStorage);
    console.log(searchLi);
}

function storeResult() {
    localStorage.setItem("result", JSON.stringify(searchResult))
}

initSearch.on("click", function (event) {
    event.preventDefault();
    var searchOutput = search.val();
    var icon = "http://openweathermap.org/img/w/";
    
    console.log(searchOutput);

    var current = moment().format("MMM-Do-YYYY");
    
    fetch(endPoint + searchOutput + apiKey)
    .then(response => response.json())
    .then(data => {
        var iconCode = data.weather[0].icon;
        var iconUrl = icon + iconCode + ".png";
        console.log(data);
        console.log(data.name);
       
        //display the value
        img.attr('src', iconUrl);
        cityName.text(data.name + " (" + current + ") ");

        var tempF = data.main.temp;
        tempF = tempF - 273.15;
        tempF = tempF * 9/5 + 32;
        tempF = Math.ceil(tempF);
        temp.text("Temperature: " + tempF + "^F");

        humidityDisplay.text("Humidity: " + data.main.humidity + "%");

        windSpeedDisplay.text("Wind Speed: " + data.wind.speed + " MPH")
        console.log(temp);
        cityDisplay.append(cityName);
        cityDisplay.append(img);
        cityDisplay.append(temp);
        cityDisplay.append(humidityDisplay);
        cityDisplay.append(windSpeedDisplay);

    })



    if (searchOutput === "") {
        return;
      }
    searchResult.push(searchOutput);

    storeResult();
    renderList();
});