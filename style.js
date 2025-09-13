const apiKey = "API_Key";

function debounce(func, delay) {
    let timeID;
    return function (...args) {
        clearTimeout(timeID);
        timeID = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

async function fetchWeather(city) {
    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        if (!res.ok) throw new Error("City not found");

        const data = await res.json();

        displayWeather(data);
        foreCast(data)
    } catch (err) {
        console.error(err);
        alert(err.message);
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

    const iconCode = data.weather[0].icon;
    document.getElementById("weatherIcon").src =
        `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
}