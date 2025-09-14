const apiKey = API_KEY;

function debounce(func, delay) {
    let timeID;
    return function (...args) {
        clearTimeout(timeID);
        timeID = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

document.addEventListener("DOMContentLoaded",()=>{
   const s = document.getElementById("searchBtn")
   s.click()
})

async function fetchWeather(city) {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!res.ok) throw new Error("City not found");

        const data = await res.json();

        displayWeather(data);
        foreCast(city)
        centerMAp(city)
    } catch (err) {
        console.error(err);
    }
}

const debounceFetch = debounce(fetchWeather, 500);

document.getElementById("searchBtn").addEventListener("click", () => {
    const input = document.getElementById("cityInput").value.trim();
    if (input) debounceFetch(input);
});

document.getElementById("cityInput").addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        const input = e.target.value.trim();
        if (input) debounceFetch(input);
    }
});

function displayWeather(data) {
    document.querySelector("#currentWeather h2").textContent = data.name;
    document.querySelector(".condition").textContent = data.weather[0].description;
    document.querySelector(".temp").textContent =` ${data.main.temp} °C`

    const iconCode = data.weather[0].icon;
    document.getElementById("weatherIcon").src =
        `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

async function foreCast(city) {
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=London&appid=${apiKey}&units=metric`);
        if (!res.ok) throw new Error("Failed to fetch the forecast data");
        const data = await res.json(); 
        displayForeWeather(data);
    } catch (err) {
        console.error(err);
    }
}

function displayForeWeather(data) {
    const foreCastContainer = document.querySelector(".forecaseCards");
    foreCastContainer.innerHTML = "";
    const dailyFore = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    dailyFore.forEach(day => {
        const card = document.createElement("div");
        const date = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" });
        const temp = Math.round(day.main.temp);
        const icon = day.weather[0].icon;
        card.innerHTML = `
            <p>${date}</p>
            <img src="http://openweathermap.org/img/wn/${icon}.png" alt="weather icon" />
            <p>${temp}°C</p>
        `;
        foreCastContainer.appendChild(card);
    });
}



// map with leaflet js lib
const map = L.map('map').setView([20,0],2)


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '© sabari'}).addTo(map);

let marker;

async function centerMAp(city) {
    try{
        const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
        const data = await res.json()
        const{lat,lon} = data[0]
        map.setView([lat,lon],10)
        if(marker){
            map.removeLayer(marker)
        }
        marker = L.circleMarker([lat,lon],{radius : 8,color:"orange"}).addTo(map)
    }catch(err){
        console.error(err);
    }
}

document.getElementById("searchBtn").addEventListener("click",()=>{
    const city = document.getElementById("cityInput").value.trim()
    if(city) centerMAp(city)
})

document.getElementById("cityInput").addEventListener("keyup", (e) => {
    if(e.key === "Enter") {
        const city = e.target.value.trim();
        if(city) centerMAp(city);
    }
});