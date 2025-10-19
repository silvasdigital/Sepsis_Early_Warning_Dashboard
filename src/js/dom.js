import { fetchWeatherData } from './weatherAPI';
import { changeCtoF, changeFtoC } from './changeUnit';
import { displayWeatherDataForCurrentLocation } from './onloadLocation';

const main = document.querySelector('main');
const searchBtn = document.querySelector('.search-bar-container img');
const searchInput = document.querySelector('.search-bar-container input');
const switchCheckbox = document.querySelector('.slider-container input');

let unit = 'F';

const searchGo = async () => {
  showLoadingComponent();
  const location = searchInput.value;
  try {
    const weatherData = await fetchWeatherData(location);
    createLocationDataElement(weatherData);
  } catch (e) {
    alert(e);
    deletePreviousResult();
    displayWeatherDataForCurrentLocation();
  }
};

searchBtn.addEventListener('click', searchGo);
searchInput.addEventListener('search', searchGo);

switchCheckbox.addEventListener('change', () => {
  if (switchCheckbox.checked === true) {
    if (document.querySelector('.location-weather-data-container')) {
      const tempElement = document.querySelector('.temp-h2');
      const tempF = Number(tempElement.getAttribute('data-temp'));
      console.log(tempF);
      const tempC = Math.round(changeFtoC(tempF));
      tempElement.setAttribute('data-temp', tempC);
      tempElement.textContent = `${tempC} °C`;
    }
    unit = 'C';
  } else {
    if (document.querySelector('.location-weather-data-container')) {
      const tempElement = document.querySelector('.temp-h2');
      const tempC = Number(tempElement.getAttribute('data-temp'));
      console.log(tempC);
      const tempF = Math.round(changeCtoF(tempC));
      tempElement.setAttribute('data-temp', tempF);
      tempElement.textContent = `${tempF} °F`;
    }
    unit = 'F';
  }
});

const createLocationDataElement = (weatherData) => {
  deletePreviousResult();

  const container = document.createElement('div');

  const addressText = document.createElement('h2');

  const mainContentContainer = document.createElement('div');
  const weatherlogo = document.createElement('img');
  const textContainer = document.createElement('div');
  const conditionText = document.createElement('h2');
  const tempText = document.createElement('h2');

  const additionalContentContainer = document.createElement('div');
  const humidity = document.createElement('h3');
  const windspeed = document.createElement('h3');

  container.classList.add('location-weather-data-container');
  mainContentContainer.classList.add('main-content-container');
  additionalContentContainer.classList.add('additional-content-container');
  textContainer.classList.add('text-container');
  tempText.classList.add('temp-h2');
  tempText.setAttribute('data-temp', weatherData.temp);

  addressText.textContent = String(weatherData.address).charAt(0).toUpperCase() + String(weatherData.address).slice(1);
  conditionText.textContent = weatherData.conditions;

  if (unit === 'F') {
    tempText.textContent = `${weatherData.temp} °F`;
  } else {
    const newTemp = Math.round(changeFtoC(Number(weatherData.temp)));
    tempText.textContent = `${newTemp} °C`;
    tempText.setAttribute('data-temp', newTemp);
  }

  import(`../imgs/weather-icons/${weatherData.iconType}.svg`).then((response) => {
    weatherlogo.src = response.default;
  });

  humidity.textContent = `Humidity: ${weatherData.humidity} %`;
  windspeed.textContent = `Windspeed: ${weatherData.windspeed} kph`;

  textContainer.appendChild(conditionText);
  textContainer.appendChild(tempText);
  mainContentContainer.appendChild(weatherlogo);
  mainContentContainer.appendChild(textContainer);
  additionalContentContainer.appendChild(humidity);
  additionalContentContainer.appendChild(windspeed);
  container.appendChild(addressText);
  container.appendChild(mainContentContainer);
  container.appendChild(additionalContentContainer);
  main.appendChild(container);
};

const deletePreviousResult = () => {
  while (
    main.lastElementChild.className === 'location-weather-data-container' ||
    main.lastElementChild.className === 'loader'
  ) {
    main.removeChild(main.lastElementChild);
  }
};

const showLoadingComponent = () => {
  deletePreviousResult();
  const loadingComponent = document.createElement('div');
  loadingComponent.classList.add('loader');
  main.appendChild(loadingComponent);
};

export { createLocationDataElement, showLoadingComponent };
