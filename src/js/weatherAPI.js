const fetchWeatherData = async (location, current = false) => {
  let url;
  if (!current) {
    url = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/today?key=3UR3ZJQDXH38ABC3TSTXZ3M2Y`
    );
  } else if (current === true) {
    url = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location.lat},${location.lng}/today?key=3UR3ZJQDXH38ABC3TSTXZ3M2Y`
    );
  }
  if (url.ok) {
    const data = await url.json();
    console.log(data);
    let address;
    if (current) {
      address = `Your Current Location`;
    } else {
      address = data.resolvedAddress;
    }

    const temp = data.currentConditions.temp;
    const conditions = data.currentConditions.conditions;
    const humidity = data.currentConditions.humidity;
    const windspeed = data.currentConditions.windspeed;
    const iconType = data.currentConditions.icon;
    const objOfData = { address, temp, conditions, humidity, windspeed, iconType };
    return objOfData;
  } else {
    if (url.status === 400) {
      throw new Error(`Wrong Location`);
    } else if (url.status == 404) {
      throw new Error(`Empty Location`);
    } else {
      throw new Error(`${url.status}`);
    }
  }
};

export { fetchWeatherData };
