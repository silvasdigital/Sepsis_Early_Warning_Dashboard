import { fetchWeatherData } from './weatherAPI';
import { createLocationDataElement, showLoadingComponent } from './dom';

const displayWeatherDataForCurrentLocation = () => {
  showLoadingComponent();
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const location = { lat: Math.round(lat * 100) / 100, lng: Math.round(lng * 100) / 100 };
        const weatherData = await fetchWeatherData(location, true);
        createLocationDataElement(weatherData);
      },
      async () => {
        try {
          const weatherData = await fetchWeatherData('United Kingdom');
          createLocationDataElement(weatherData);
        } catch (e) {
          alert(e);
        }
      }
    );
  } else {
    async () => {
      try {
        const weatherData = await fetchWeatherData('United Kingdom');
        createLocationDataElement(weatherData);
      } catch (e) {
        alert(e);
      }
    };
  }
};

export { displayWeatherDataForCurrentLocation };
