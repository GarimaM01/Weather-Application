// Constants for API URLs and keys
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_KEY = '91b409780056d2a93b7ed1e9cb35e39a'; // Replace with your OpenWeatherMap API key
const API_ICON = 'http://openweathermap.org/img/wn/';
const IMG_BACKGROUND = 'https://source.unsplash.com/1600x900/?'; // Replace with your image background URL

// Function to fetch weather data from the API
const getWeatherData = async (weatherCity) => {
  try {
    // Fetch weather data from the API
    const response = await fetch(`${API_URL}?q=${weatherCity}&units=metric&appid=${API_KEY}`);
    // Check if the response is successful
    if (!response.ok) {
      // If not successful, throw an error
      throw new Error('City or Country not found');
    }
    // Parse the response data as JSON
    const weatherData = await response.json();
    // Return the weather data
    return weatherData;
  } catch (error) {
    // Log and re-throw any errors that occur during fetching
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Function to update the UI with weather data
const updateUI = (data, weatherCity) => {
  try {
    // Check if data is available
    if (!data) return;

    // Destructure data object
    const {
      name: city,
      sys: { country, sunrise, sunset },
      main: { temp, temp_min, temp_max, humidity },
      weather: [{ main: description, icon }],
      wind: { speed },
      timezone,
    } = data;

    // Update UI elements with weather data
    document.querySelector(".city-name").textContent = `Weather in ${city}, ${country}`;
    document.querySelector(".temp").textContent = `${temp.toFixed(1)} °C`;
    document.querySelector(".temp-min").textContent = `Min:${temp_min.toFixed(1)} °C`;
    document.querySelector(".temp-max").textContent = `Max:${temp_max.toFixed(1)} °C`;
    document.querySelector(".description-weather").textContent = `${description}`;
    document.querySelector(".humidity-p").textContent = `${humidity}%`;
    document.querySelector(".wind-p").textContent = `${speed} m/s`;
    document.querySelector(".icon").src = `${API_ICON}${icon}.png`;

    // Calculate and display sunrise and sunset times
    const sunriseTimeUTC = new Date((sunrise + timezone) * 1000).toUTCString().slice(-12, -4);
    const sunsetTimeUTC = new Date((sunset + timezone) * 1000).toUTCString().slice(-12, -4);
    document.querySelector(".sunrise p").textContent = `${sunriseTimeUTC}`;
    document.querySelector(".sunset p").textContent = `${sunsetTimeUTC}`;

    // Change background image based on the weatherCity
    document.querySelector("body").style.backgroundImage = `url('${IMG_BACKGROUND}${weatherCity}')`;

    // Clear the "City or Country not found" message if the data is found
    document.querySelector(".not-found").textContent = '';
  } catch (error) {
    // Log and display an error message if updating the UI fails
    console.error('Error updating UI:', error);
    document.querySelector(".not-found").textContent = 'Entered city or country not found';
  }
};

// Function to get weather data and update UI for a given city
const getWeatherApp = async (weatherCity) => {
  try {
    // Call the function to fetch weather data for the given city
    const weatherData = await getWeatherData(weatherCity);
    // Update the UI with the fetched weather data
    updateUI(weatherData, weatherCity);
  } catch (error) {
    // Log and display an error message if fetching weather data fails
    console.error('Error:', error.message);
    document.querySelector(".not-found").textContent = 'Entered city or country not found';
  }
};

// Display weather for the default city when the page loads
getWeatherApp("Mumbai");

// Event listener for the search button
const btnSearch = document.querySelector(".btn-src");
btnSearch.addEventListener("click", () => {
  // Get the value from the search input and call the getWeatherApp function
  const inputValue = document.querySelector(".search-bar").value;
  getWeatherApp(inputValue);
});

// Event listener for the enter key press in the search input
let inputEnter = document.querySelector(".search-bar");
inputEnter.addEventListener("keyup", (event) => {
  // Check if the enter key is pressed
  if (event.keyCode === 13) {
    event.preventDefault();
    // Trigger a click on the search button
    btnSearch.click();
  }
});
